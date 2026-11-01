# Kategorier – Novverk (novverk.no)

Guía de categorías de la tienda (teknologi, mobiltilbehør og smarthjem). Fecha: 2026-11-01. Documento de referencia: **no cambia nada publicado**. Cuando Willy pida ordenar/añadir productos, se aplica esto.

## Principios

- Categorías por **tipo de producto** (estilo Clas Ohlson / Europris / Jollyroom / Kid Interiør), nombres en **noruego bokmål**, orden fijo abajo.
- **Sin filtros ni colecciones por marca/proveedor** (CJ, Printful, Gelato, Printify no son categorías).
- Cada producto en **una** categoría principal + **una** subcategoría. Sin huérfanos (`Beauty`, `Energy`, `Home & Living`, `Diverse` en inglés/genéricos no valen).
- **No publicar categorías vacías**: una categoría/subcategoría sin productos se oculta del menú hasta tener al menos 1 producto (ideal ≥3).
- Slug URL en minúsculas sin æøå (æ→ae, ø→o, å→a): `/kategori/<slug>`.
- Títulos de producto en noruego describiendo lo que ES (no títulos SEO del proveedor en inglés).
- No tocar precios ni textos legales al recategorizar.

## Árbol de categorías (orden del menú)

| # | Kategori | Slug | Underkategorier | Regla: qué entra |
|---|---|---|---|---|
| 1 | **Mobiltilbehør** | `mobiltilbehor` | Mobildeksler og mobilbånd · Telefonholdere til bil · Holdere til sykkel og motorsykkel · Mobilstativ og holdere | Alt som festes på eller holder mobilen. |
| 2 | **Lading og kabler** | `lading-og-kabler` | Ladekabler · Trådløse ladere · Kabelorganisering og reiseetui | Kabler, ladere, organisering. |
| 3 | **Lyd** | `lyd` | Bluetooth-høyttalere | Høyttalere og lydprodukter. |
| 4 | **Smarthjem** | `smarthjem` | Overvåkingskamera · Smarte låser og dørsensorer · Robotstøvsugere · Smart styring (gardinrobot, smartring) | WiFi/app-styrte produkter for hjemmet. |
| 5 | **Foto og video** | `foto-og-video` | Kamerabraketter og stativ · Tilbehør til actionkamera og gimbal | Kamera-/gimbalholdere. |
| 6 | **Gadgets og diverse elektronikk** | `gadgets` | Tegnebrett · Bil-elektronikk | Små elektroniske produkter som ikke passer over (LCD-tegnebrett, ultralyd skadedyrjager). |

## Reglas de asignación

1. Lee el título/descripción y decide qué ES el producto (función principal), no dónde se usa ni quién lo vende.
2. Elige la primera categoría de la tabla cuya regla encaje; si encaja en dos, gana la más específica.
3. Si no encaja en ninguna: no inventes categoría nueva por un solo producto; usa la categoría más cercana y anótalo aquí. Nueva categoría solo con ≥3 productos del mismo tipo.
4. Campo `category` en `catalog/*.json` = nombre noruego exacto de la tabla; añadir `subcategory` con el nombre exacto de la subcategoría.
5. Cada categoría visible necesita su texto en `catalog/category-intros.json` (`no` = nombre exacto).

## Estado actual (diagnóstico 2026-11-01, sin cambios aplicados)

- Intros existentes en `category-intros.json`: Nettverk og tilkobling, Sensorer og varsling, Smart belysning, Smarthjemstyring, Smarthjemtilbehør.
- Valores actuales de `category` en el catálogo: ver `catalog/selected-products.json`; los genéricos/en inglés deben migrarse a esta tabla cuando se ordene.

## Al aplicar (cuando se ordene)

Rama nueva → backup en `/workspace/backups/<tienda>-AAAAMMDD` → reasignar `category`/`subcategory` → build local → deploy Cloudflare Pages según README → verificar menú, una página de categoría y un producto en el dominio .no. Rollback: Cloudflare Pages → Deployments → *Rollback* al despliegue anterior, o redeploy del commit previo.
