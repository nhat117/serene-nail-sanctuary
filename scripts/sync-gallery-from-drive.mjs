// Sync local image folders to Cloudinary, then rewrite
// src/data/gallery-imports.ts with the resulting public ids.
//
// Source-side dedupe: MD5 every local file first, keep only one file per
// unique hash across ALL groups. Prevents the same photo (nails vs salon
// folders often share files) from being uploaded twice.
//
// Reads:  tmp/drive-nails/ and tmp/drive-salon/
// Writes: tmp/upload-manifest.json (bookkeeping)
//         src/data/gallery-imports.ts (frontend source of truth)
//
// Usage:
//   CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud> node scripts/sync-gallery-from-drive.mjs

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { basename, extname, resolve, join } from "node:path";

const GROUPS = [
  { dir: "tmp/drive-nails", folder: "estique/gallery/drive-import", prefix: "nail" },
  { dir: "tmp/drive-salon", folder: "estique/gallery/drive-import", prefix: "salon" },
];

const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

function parseCreds() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) throw new Error("CLOUDINARY_URL is required");
  const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) throw new Error("CLOUDINARY_URL must look like cloudinary://<key>:<secret>@<cloud>");
  return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
}

function sign(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

async function uploadOne({ filePath, publicId, folder, cloudName, apiKey, apiSecret }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    folder,
    overwrite: "true",
    public_id: publicId,
    timestamp,
  };
  const signature = sign(paramsToSign, apiSecret);

  const form = new FormData();
  const buf = readFileSync(filePath);
  form.append("file", new File([buf], basename(filePath)));
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("overwrite", "true");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Upload failed for ${publicId}: ${JSON.stringify(json)}`);
  return json;
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function pool(items, worker) {
  const results = new Array(items.length);
  let i = 0;
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}

function md5File(filePath) {
  return createHash("md5").update(readFileSync(filePath)).digest("hex");
}

async function main() {
  const creds = parseCreds();
  const manifest = [];
  mkdirSync("tmp", { recursive: true });

  // Pass 1 — gather every candidate file with its MD5.
  const candidates = [];
  for (const g of GROUPS) {
    const abs = resolve(process.cwd(), g.dir);
    if (!existsSync(abs)) {
      console.log(`(skip ${g.dir} — does not exist)`);
      continue;
    }
    const files = readdirSync(abs).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    for (const f of files) {
      const filePath = join(abs, f);
      candidates.push({
        group: g,
        filePath,
        filename: f,
        md5: md5File(filePath),
      });
    }
  }

  // Pass 2 — dedupe by MD5 across ALL groups. First occurrence wins so the
  // "nails" group beats "salon" when they contain the same bytes (rare but
  // possible — same photo saved in both Drive folders).
  const seenHashes = new Map(); // md5 -> filename that won
  const skipped = []; // { filename, group, duplicate_of }
  const survivors = [];
  for (const c of candidates) {
    if (seenHashes.has(c.md5)) {
      skipped.push({ filename: c.filename, group: c.group.dir, duplicate_of: seenHashes.get(c.md5) });
      continue;
    }
    seenHashes.set(c.md5, c.filename);
    survivors.push(c);
  }

  if (skipped.length > 0) {
    console.log(`\nSkipping ${skipped.length} exact-duplicate file(s) by MD5:`);
    for (const s of skipped) console.log(`  ${s.filename}  (dup of ${s.duplicate_of})`);
  }

  // Pass 3 — upload survivors, grouped so ordering in the manifest is stable.
  for (const g of GROUPS) {
    const groupFiles = survivors.filter((s) => s.group === g);
    if (groupFiles.length === 0) continue;
    console.log(`\n${g.dir}: ${groupFiles.length} files -> ${g.folder} (prefix "${g.prefix}")`);
    const items = groupFiles.map((s) => ({
      filePath: s.filePath,
      filename: s.filename,
      md5: s.md5,
      publicId: `${g.prefix}-${slugify(basename(s.filename, extname(s.filename)))}`,
      folder: g.folder,
    }));
    await pool(items, async (it, idx) => {
      const pad = String(idx + 1).padStart(3, " ");
      try {
        const r = await uploadOne({ ...it, ...creds });
        manifest.push({
          filename: it.filename,
          folder: g.folder,
          public_id: r.public_id,
          format: r.format,
          bytes: r.bytes,
          width: r.width,
          height: r.height,
          md5: it.md5,
          etag: r.etag || null,
        });
        console.log(`  [${pad}/${items.length}] ok  ${r.public_id}  etag=${r.etag || "-"}`);
      } catch (e) {
        console.log(`  [${pad}/${items.length}] FAIL ${it.filename}: ${e.message}`);
      }
    });
  }

  writeFileSync("tmp/upload-manifest.json", JSON.stringify(manifest, null, 2));
  console.log(`\nWrote tmp/upload-manifest.json (${manifest.length} entries)`);

  // Also regenerate src/data/gallery-imports.ts so the frontend picks up new
  // public ids automatically. Runtime ETag dedupe on the client handles
  // duplicates — no hashes need to live in this file.
  const byPrefix = { nail: [], salon: [] };
  for (const m of manifest) {
    const local = m.public_id.split("drive-import/")[1];
    if (!local) continue;
    const prefix = local.startsWith("nail-") ? "nail" : local.startsWith("salon-") ? "salon" : null;
    if (!prefix) continue;
    byPrefix[prefix].push(local);
  }
  byPrefix.nail.sort();
  byPrefix.salon.sort();
  const lines = [];
  lines.push("// Generated by scripts/sync-gallery-from-drive.mjs.");
  lines.push("// Gallery.tsx dedupes at mount time by HEAD-fetching each URL and");
  lines.push("// comparing Cloudinary's ETag. No hashes stored here.\n");
  lines.push("export const driveNailIds: readonly string[] = [");
  for (const id of byPrefix.nail) lines.push(`  "${id}",`);
  lines.push("];\n");
  lines.push("export const driveSalonIds: readonly string[] = [");
  for (const id of byPrefix.salon) lines.push(`  "${id}",`);
  lines.push("];\n");
  writeFileSync("src/data/gallery-imports.ts", lines.join("\n"));
  console.log(`Wrote src/data/gallery-imports.ts (${byPrefix.nail.length} nail + ${byPrefix.salon.length} salon)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
