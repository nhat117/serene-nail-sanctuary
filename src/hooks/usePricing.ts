import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PriceCellRow = {
  id: string;
  column_id: string;
  value: string;
};

export type PriceRowRow = {
  id: string;
  service: string;
  sort_order: number;
  price_cells: PriceCellRow[];
};

export type PriceColumnRow = {
  id: string;
  label: string;
  sort_order: number;
};

export type PriceTableRow = {
  id: string;
  title: string;
  note: string | null;
  sort_order: number;
  price_columns: PriceColumnRow[];
  price_rows: PriceRowRow[];
};

export type PricingNoteRow = {
  id: string;
  title: string;
  body: string;
  highlight: string | null;
  icon: string | null;
  sort_order: number;
};

export type PriceCategoryRow = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  price_tables: PriceTableRow[];
  pricing_notes: PricingNoteRow[];
};

export function usePricing() {
  return useQuery<PriceCategoryRow[]>({
    queryKey: ["pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_categories")
        .select(
          `
          id, slug, name, sort_order,
          price_tables (
            id, title, note, sort_order,
            price_columns ( id, label, sort_order ),
            price_rows (
              id, service, sort_order,
              price_cells ( id, column_id, value )
            )
          ),
          pricing_notes ( id, title, body, highlight, icon, sort_order )
        `,
        )
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      const categories = (data ?? []) as unknown as PriceCategoryRow[];

      // Sort nested collections — Supabase doesn't apply parent .order() to children.
      for (const cat of categories) {
        cat.price_tables.sort((a, b) => a.sort_order - b.sort_order);
        cat.pricing_notes.sort((a, b) => a.sort_order - b.sort_order);
        for (const t of cat.price_tables) {
          t.price_columns.sort((a, b) => a.sort_order - b.sort_order);
          t.price_rows.sort((a, b) => a.sort_order - b.sort_order);
        }
      }
      return categories;
    },
    staleTime: 5 * 60 * 1000,
  });
}
