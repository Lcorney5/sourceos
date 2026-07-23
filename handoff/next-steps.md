# Next Steps

*(part of the [handoff folder](./README.md)) — roughly in the order they'd naturally come up*

1. **Resolve the Squarespace DNS sync issue** (see
   [current-state.md](./current-state.md) → In Progress) — re-check directly
   with `nslookup` against the authoritative nameserver; follow up with
   Squarespace support if still stale.
2. **Finish SMTP setup** once the domain resolves: `NEXT_PUBLIC_SITE_URL` →
   `https://sourceos.com` in Vercel, Resend SMTP credentials into Supabase,
   test signup with real Gmail + Yahoo addresses and check message headers
   for SPF/DKIM/DMARC all passing.
3. **Twilio WhatsApp** — was discussed but not decided-and-shipped; leaning
   toward *not* building the full Business API integration and instead just
   storing a WhatsApp number + click-to-chat (`wa.me/`) link + the existing
   manual communication-log fallback, since the full integration's cost/
   complexity (Meta business verification, per-message billing) isn't
   clearly worth it pre-revenue. This was decided in conversation but never
   actually implemented — worth revisiting and building whichever direction
   is chosen.
4. **Google OAuth**, **Stripe live mode**, **legal review** — all still
   outstanding, untouched so far.
5. **Customer acquisition** — no code, but concrete next actions exist: post
   the two Reels videos (`C:\Users\17703\Desktop\SourceOS Reels\`) to
   Instagram once transferred to a phone, run the outreach DM template and
   founding-member pitch drafted in a recent session in Reddit/Facebook
   sourcing communities and Indie Hackers/Starter Story, aiming for the
   first 10-20 founding users. See session transcript for the exact
   templates if not saved elsewhere.
6. **Smaller open items carried over**: no automated test suite; "Delivered"
   PO badge uses steel not green (no green in the palette); Products link to
   Quotes/Samples/POs via text-matching, not a real foreign key — still fine
   for now.
7. **Smaller open items from the multi-client-workspaces work**: Agency plan
   downgrade doesn't currently revoke already-created client workspaces
   (deliberately deferred — "grandfather them" was the explicit decision,
   revisit if it matters later); no "delete client workspace" UI exists; an
   existing single-workspace user cannot currently also join a client
   workspace as an invited member (only fresh signups can) — deliberate
   scope decision, revisit if a real use case comes up.
