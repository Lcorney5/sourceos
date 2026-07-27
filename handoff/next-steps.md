# Next Steps

*(part of the [handoff folder](./README.md)) — roughly in the order they'd naturally come up*

0. **BLOCKING — fix the Stripe live/test mode mismatch before sending anyone
   else to the pricing page.** See
   [known-issues.md](./known-issues.md) for full detail. Either (a) get
   live-mode Price IDs from Stripe (Dashboard → toggle Live mode → Products)
   and update `NEXT_PUBLIC_STRIPE_PRICE_STARTER/GROWTH/AGENCY` in Vercel
   Production to match, since `STRIPE_SECRET_KEY` there is already a live
   key, or (b) replace `STRIPE_SECRET_KEY` in Vercel Production with a test
   key (`sk_test_...`) to match the existing test-mode price IDs if not
   ready to take real payments yet. The fail-open fallback (checkout errors
   granting free dashboard access) is already fixed — this item is now just
   the key/price-ID mismatch itself.
0b. **Verify the Server Actions `allowedOrigins` fix actually solved the
   "Save Changes doesn't work" report on the supplier page** — added
   `sourceos-gamma.vercel.app`, `souceos.com`, and `www.souceos.com` to
   `next.config.ts`'s `serverActions.allowedOrigins`, since Next 16 rejects
   Server Action requests whose `Origin` doesn't match an allowed host and
   this app is reachable on all three. Plausible root cause, not confirmed —
   needs a real logged-in test. If it still fails, check the browser
   console/network tab for the actual error on submit next.
1. **Check the apex domain SSL certificate** (`souceos.com`, no `www`) — was
   still failing an SSL handshake as of this handoff despite Vercel showing
   "Valid Configuration." `www.souceos.com` already works fully. Just
   `curl -I https://souceos.com/` (or check in a browser) to see if it's
   resolved; if it's been many hours with zero change, try removing and
   re-adding the domain in Vercel to force a fresh certificate attempt.
2. **Once the apex domain works**: update `NEXT_PUBLIC_SITE_URL` in Vercel
   from the `.vercel.app` URL to `https://www.souceos.com`, update the Google
   Ads campaign's final URLs/sitelinks (currently pointing at the `.vercel.app`
   URL with a note to swap once ready), and update any outreach message
   links the same way.
3. ~~Finish SMTP setup~~ — **done this session**, see
   [changelog.md](./changelog.md) #29-30. Confirmation emails send via
   Resend on the verified `souceos.com` domain; confirmed with a real
   Yahoo address (HTTP 200, `confirmation_sent_at` populated). Pick a real
   sender address (e.g. `noreply@souceos.com`) in Supabase's SMTP settings
   if still using a placeholder.
4. **Fill in the three legal-doc placeholders** — legal entity name,
   governing-law state/city, and business mailing address in `/privacy` and
   `/terms` (all marked `[...]` in the page text; mailing address added this
   session, needed for CAN-SPAM once any promotional email is sent). Quick,
   no urgency, but should happen before relying on these pages, and get an
   actual attorney review before scaling real payments (especially the
   liability limitation and auto-renewal language) — the CCPA/GDPR sections
   added this session are a good-faith pass, not legal advice.
4b. **Self-serve account/data deletion + export** — the Privacy Policy
   previously promised this "any time" but it was never actually built (see
   [changelog.md](./changelog.md) #35); the policy now says "contact us"
   instead, which is accurate but weaker UX. Worth building a real feature
   if this becomes a common request or a compliance requirement scales up.
5. **Twilio + phone sign-in** — if/when ready to pay: create a Twilio
   account, buy a phone number, set up a Messaging Service (get its
   `MG...` Service SID), then enable the Phone provider in Supabase's Auth
   settings with those credentials. Re-enabling the UI is then just
   re-adding the `PhoneAuthForm` import + JSX back into `/login` and
   `/signup` (removed, not deleted — see [changelog.md](./changelog.md) #19).
6. **Customer acquisition — concrete, ready-to-execute items**:
   - **Start working the cold-call list** — 102 real companies with
     verified phone numbers, ranked by fit (direct product importers and
     house-brand shops first, freight-forwarder/broker referral asks
     second). Saved as `SourceOS_Cold_Call_List.csv`/`.xlsx` on the Desktop
     and as an interactive artifact with click-to-call, status tracking,
     and a full call script (direct pitch vs. referral ask, objection
     handling, voicemail script) on its second tab. **Don't send anyone to
     the pricing page until item 0 above is actually resolved.**
   - Back the top 2 recommended Kickstarter leads (Nguyen Lam/BLOCHILD,
     Charl Le Roux/Blue Crane Jacket) and send the drafted DMs — see
     `growth-outreach-templates.md` in the outside-repo HANDOFF folder for
     the full ranked list of 7 and exact message text.
   - Rewrite and post the Reddit reply personally (drafted version was
     blocked by that subreddit's "no AI content" rule).
   - Post the drafted X post/thread; start the X search-and-reply routine
     using the given search queries (supplier-chaos + Amazon FBA/private-
     label phrasing).
   - Post the two Instagram Reels videos
     (`C:\Users\17703\Desktop\SourceOS Reels\`) once transferred to a phone.
   - LinkedIn cold search wasn't productive this session (see
     [known-issues.md](./known-issues.md)) — don't retry the same approach
     without either a bigger existing network or a paid LinkedIn tier.
7. ~~Twilio WhatsApp Business API~~ — **decided and executed this session**:
   removed entirely (Connect UI, message thread, webhook, the whole Messages
   page — see [changelog.md](./changelog.md) #36) rather than left
   unconfigured. What's left matches the original lean: a plain
   `contact_phone` field on suppliers plus the existing manual
   Communication Log. A `wa.me/` click-to-chat link using that number would
   be a small, cheap addition if wanted later.
8. **Google OAuth** is done. **Stripe live mode** — see item 0, in progress
   as of this handoff.
9. **Business formation (LLC or similar)** — came up this session, purely as
   a conversation, no action taken. General tradeoffs (liability separation,
   business banking, not required to accept Stripe payments as a sole
   proprietor) were discussed, but this needs a real accountant/lawyer for
   anything state-specific — not something to resolve in a coding session.
10. **Smaller open items carried over from before**: no automated test suite;
   "Delivered" PO badge uses steel not green (no green in the palette);
   Products link to Quotes/Samples/POs via text-matching, not a real foreign
   key; Agency-plan downgrade doesn't revoke already-created client
   workspaces (deliberate, "grandfather them" was the explicit decision); no
   "delete client workspace" UI; an existing single-workspace user can't also
   join a client workspace as an invited member (only fresh signups can,
   deliberate scope decision).
