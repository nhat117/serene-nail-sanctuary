import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BranchHoursRow = {
  id: string;
  days_label: string;
  hours_label: string;
  sort_order: number;
};

export type BranchRow = {
  id: string;
  slug: string;
  name: string;
  short_label: string;
  city: string | null;
  address: string;
  address_note: string | null;
  phone: string | null;
  instagram: string | null;
  map_embed_url: string | null;
  image_url: string | null;
  public_holidays: string | null;
  sort_order: number;
  branch_trading_hours: BranchHoursRow[];
};

export function useBranches() {
  return useQuery<BranchRow[]>({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branches")
        .select(
          `
          id, slug, name, short_label, city,
          address, address_note, phone, instagram,
          map_embed_url, image_url, public_holidays, sort_order,
          branch_trading_hours ( id, days_label, hours_label, sort_order )
        `,
        )
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      const branches = (data ?? []) as unknown as BranchRow[];
      for (const b of branches) {
        b.branch_trading_hours.sort((a, c) => a.sort_order - c.sort_order);
        // Pending Supabase update: force the live Estique handle.
        b.instagram = "@estique.kirrawee";
      }
      return branches;
    },
    staleTime: 5 * 60 * 1000,
  });
}
