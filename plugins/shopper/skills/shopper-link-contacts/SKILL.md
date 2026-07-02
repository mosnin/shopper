---
name: shopper-link-contacts
description: Keep Shopper tidy: link seller contacts to sellers, dedupe, and vet the right way.
---

# Keep the wish list clean

Shopper is built around the contact-to-seller relationship. A seller contact
(a person at a store, marketplace, or manufacturer) is most useful when it is
linked to its seller.

## Steps
1. Find unassigned people with list_seller_contacts, then link each to its
   seller with update_seller_contact and the seller's entityId. Look the
   seller up first with list_sources or search_wishlist; create it with
   create_source only if it truly does not exist (never a duplicate).
2. Use extract_seller_details on a store site to pull public emails, phones,
   and socials, then review and save selectively with create_seller_contact,
   passing entityId so the person lands on the right seller.
3. To vet many records, work through them with enrich_source and
   enrich_seller_contact; already-filled fields should be left alone.

## Rules
- Match by domain first, then name. Never create a second seller for the same
  domain.
- Never link a person to a seller on a name coincidence; prefer leaving them
  unassigned over a wrong link.
