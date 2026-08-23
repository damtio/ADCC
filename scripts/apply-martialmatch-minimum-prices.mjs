import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const prices = {
  "iii-otwarte-mistrzostwa-dolnego-slaska-bjj-3rd-lower-silesia-bjj-open": 120,
  "xxiv-puchar-polski-bjj-24th-polish-bjj-cup": 140,
  "ogolnopolska-liga-ju-jitsu-katowice-2026-09": 60,
  "copa-14-gi-nogi": 120,
  "iii-open-fire-carioca-cup": 120,
  "xvi-puchar-polski-no-gi-jiu-jitsu-2026": 140,
  "koledzy-cup-vol-5": 120,
  "bone-breakers-cup-2026": 140,
  "open-baltic-cup-2026": 100,
  "xvii-fight-grappler-cup-2026": 130,
  "iii-bjj-colored-belts-championships": 130,
  "taga-copa-poland-2026": 130,
  "jelcz-laskowice-cup-iv": 100,
  "malopolska-liga-salt-cup-2026": 120,
  "malopolska-liga-cracow-cup-2026": 120,
  "ground-game-cup-9-2026": 100,
  "iii-zimowe-akademickie-mistrzostwa-polski-bjj-2026": 100,
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

for (const [slug, price] of Object.entries(prices)) {
  const { data, error } = await supabase
    .from("events")
    .update({ price, currency: "PLN" })
    .eq("slug", slug)
    .is("user_id", null)
    .select("slug,price");
  if (error) throw error;
  if (data.length !== 1) throw new Error(`Expected one admin event for ${slug}`);
  console.log(`price: ${slug} = ${price} PLN`);
}

const { data: publishable, error: publishableError } = await supabase
  .from("events")
  .select("id,slug")
  .is("user_id", null)
  .eq("published", false)
  .not("price", "is", null)
  .not("image_url", "is", null);
if (publishableError) throw publishableError;

if (publishable.length > 0) {
  const ids = publishable.map(({ id }) => id);
  const { error: publishError } = await supabase
    .from("events")
    .update({ published: true })
    .in("id", ids)
    .is("user_id", null)
    .eq("published", false);
  if (publishError) throw publishError;
}

console.log(`published: ${publishable.map(({ slug }) => slug).join(", ") || "none"}`);
