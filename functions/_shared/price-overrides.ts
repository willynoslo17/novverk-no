/** Norway market price matching (2026-10-30). Keys are CJ product ids (pid).
 * PRICE_OVERRIDE: regular NOK price aligned to the Norwegian market, never below the profit floor.
 * HIDDEN: profit floor is above the Norwegian market price -> product is hidden (not deleted). */
export const PRICE_OVERRIDE: Record<string, number> = {"D50E2A54-713F-4371-91DB-595A2B45A08F": 499, "2504081010071629900": 399, "989BFA06-5A5F-4B6B-9E1B-CD82FFCAE197": 399};
/* 2026-10-30: products without required certification removed from store (owner order). */
export const HIDDEN = new Set<string>(["1563124003232034816", "CD6A14B6-2DC9-400F-9BD0-B6AFF13B31A0", "AF026B76-6E61-491D-B58B-97496A5AE4AB"]);
