---
name: shopper-discover
description: Hunt items, stores, and local sellers with Shopper and save the finds to the wish list.
---

# Hunt items and stores with Shopper

Use Shopper's hunting tools to turn "I want X" into real, saved, comparable finds.

## When to use
- The user wants something specific ("a used Eames lounge chair under $2k").
- You want real listings and stores, not a raw list of links.

## How to work
1. Orient first: call get_user_context to load the About You profile (sizes,
   brands, budgets) and search_wishlist so you build on saved records instead
   of duplicating them.
2. Hunt with find_items: describe the item and pick a count. It searches across
   stores, marketplaces, and listings via deep research and saves the new
   finds to the wish list, deduped by domain then name.
3. For shopping nearby (thrift stores, furniture shops, dealerships), use
   find_local_stores with a query plus a location - it pulls stores from
   Google Maps with name, website, phone, and address.
4. Use search_web and google_search for research only: price checks, reviews,
   availability. Review-and-save the good ones with create_source; never
   present a raw search hit as a vetted find.

## Rules
- Always carry the price, condition, and URL with a saved item (notes field).
- Never save a record without a real name. Skip anything labeled unknown.
- One seller per domain. Do not create duplicates.
