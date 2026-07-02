---
name: shopper-intent-monitors
description: Set up Radar standing scans and background research in Shopper.
---

# Watch a market with Radar

## Radar standing scans
- For an item worth waiting for (a discontinued lens, a fair-priced GPU, a
  specific vintage piece), set up a Radar scan with what you want, then
  "Schedule recurring". Shopper re-runs the hunt (the same engine as
  find_items) and saves new matching listings automatically, deduped against
  the wish list. Radar is available on paid plans.

## Background research
- From "Deep research", schedule a recurring job. Target a specific seller or
  saved item to keep its notes and prices fresh, or leave it open to save new
  sources as records.

## Notifications
- Set an "Agent notifications webhook" in Settings. When a scheduled scan
  completes, Shopper POSTs the new finds to your URL so your agent can wake up
  and act on them: compare with search_wishlist, vet with verify_seller and
  enrich_source, then flag the buy or add it to a shopping list with
  add_to_shopping_list.
