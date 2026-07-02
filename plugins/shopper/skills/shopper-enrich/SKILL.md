---
name: shopper-enrich
description: Vet sellers and seller contacts in Shopper without ever attaching the wrong record.
---

# Vet a seller before you buy

## Sellers and sources
- Run enrich_source on an unknown store or supplier to add company data and
  firmographics from its domain - the first pass before recommending a buy.
- Run verify_seller before a big purchase or a new supplier: it checks
  authoritative public registries (GLEIF, Companies House, SEC EDGAR) and adds
  legal name, jurisdiction, registration status, and officers, with
  provenance. This is the scam check, and it is free.
- Run detect_store_tech to fingerprint the store's website (ecommerce
  platform, payments, support tools) and judge how established a shop is.

## Seller contacts
- On a seller contact, fill missing fields only with enrich_seller_contact:
  pass the contact id and which field (linkedin, email, or phone).
- Email and phone require the contact to be tied to a real seller domain
  (their website, linked seller via entityId, or a work email at the store's
  domain).

## Accuracy (non-negotiable)
- Enrichment must match the RIGHT person and seller. It is verified against
  the person's name AND company before saving; a work email must be at the
  seller's own domain.
- If a confident match cannot be made, do nothing and say "couldn't find it".
  A wrong value is never acceptable.
