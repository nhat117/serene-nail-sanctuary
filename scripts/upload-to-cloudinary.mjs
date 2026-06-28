// Upload every image in src/assets/gallery/ to Cloudinary under the
// "estique/gallery" folder, then print a mapping (filename → publicId)
// you can use to switch from local imports to <img src={cld(...)} />.
//
// Run with both halves of your Cloudinary creds in the environment.
// DO NOT hard-code secrets here. Example:
//
//   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@dzzoimn4v \
//     node scripts/upload-to-cloudinary.mjs
//
// or the discrete variant:
//
//   CLOUDINARY_CLOUD_NAME=dzzoimn4v \
//   CLOUDINARY_API_KEY=... \
//   CLOUDINARY_API_SECRET=... \
//     node scripts/upload-to-cloudinary.mjs

import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

const GALLERY_DIR = resolve(process.cwd(), "src/assets/gallery");
const REMOTE_FOLDER = "estique/gallery";

function parseCreds() {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!m) throw new Error("CLOUDINARY_URL must look like cloudinary://<key>:<secret>@<cloud>");
    return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Set CLOUDINARY_URL, or all of CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET. Never commit these.",
    );
  }
  return {
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
    cloudName: CLOUDINARY_CLOUD_NAME,
  };
}

function sign(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

async function uploadOne({ filePath, publicId, cloudName, apiKey, apiSecret }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    folder: REMOTE_FOLDER,
    public_id: publicId,
    overwrite: "true",
    timestamp,
  };
  const signature = sign(paramsToSign, apiSecret);

  const form = new FormData();
  const buf = readFileSync(filePath);
  // Node 18+ has global File; fallback to Blob otherwise.
  const blob = typeof File !== "undefined"
    ? new File([buf], basename(filePath))
    : new Blob([buf]);
  form.append("file", blob, basename(filePath));
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", REMOTE_FOLDER);
  form.append("public_id", publicId);
  form.append("overwrite", "true");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Upload failed for ${publicId}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  const creds = parseCreds();
  const files = readdirSync(GALLERY_DIR).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  if (files.length === 0) {
    console.error("No images found in", GALLERY_DIR);
    process.exit(1);
  }
  console.log(`Uploading ${files.length} files to ${creds.cloudName}/${REMOTE_FOLDER}\n`);

  const mapping = {};
  for (const f of files) {
    const publicId = basename(f, extname(f));
    process.stdout.write(`→ ${f} ... `);
    try {
      const json = await uploadOne({
        filePath: resolve(GALLERY_DIR, f),
        publicId,
        ...creds,
      });
      mapping[f] = `${json.public_id}.${json.format}`;
      console.log("ok");
    } catch (err) {
      console.log("FAILED");
      console.error("  ", err.message);
    }
  }

  console.log("\nMapping (paste into a manifest):");
  console.log(JSON.stringify(mapping, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
