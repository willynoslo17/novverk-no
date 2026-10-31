/** Norway market price matching (2026-10-30). Keys are CJ product ids (pid).
 * PRICE_OVERRIDE: regular NOK price aligned to the Norwegian market, never below the profit floor.
 * 2026-10-31: competitor match (cheapest Norwegian offer via Klarna/Prisguide minus 10-20 NOK, ending in 9, never below cost floor + 10 %).
 * HIDDEN: profit floor is above the Norwegian market price -> product is hidden (not deleted). */
export const PRICE_OVERRIDE: Record<string, number> = {"D50E2A54-713F-4371-91DB-595A2B45A08F": 499, "2504081010071629900": 399, "989BFA06-5A5F-4B6B-9E1B-CD82FFCAE197": 399, "E3A1A10B-6164-4B0E-8439-396E5413E02C": 279, "1476145805931974656": 169, "5F5738BD-AF9E-4CBD-8886-724A7B62E892": 179, "1604310985484021760": 259, "5DB92F4C-EF47-4679-91AF-2E68A314AE7E": 129, "2501040918201605600": 119};
/* 2026-10-30: products without required certification removed from store (owner order). */
export const HIDDEN = new Set<string>(["1563124003232034816", "CD6A14B6-2DC9-400F-9BD0-B6AFF13B31A0", "AF026B76-6E61-491D-B58B-97496A5AE4AB"]);
