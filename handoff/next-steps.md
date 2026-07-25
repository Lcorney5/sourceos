# Next Steps

*(part of the [handoff folder](./README.md)) — roughly in the order they'd naturally come up*

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
3. **Finish SMTP setup**: get Resend SMTP credentials into Supabase's
   Auth → Emails → SMTP settings, test signup with real Gmail + Yahoo
   addresses, confirm SPF/DKIM/DMARC all pass in the message headers.
4. **Fill in the two legal-doc placeholders** — legal entity name and
   governing-law state/city in `/privacy` and `/terms` (both marked `[...]`
   in the page text). Quick, no urgency, but should happen before relying on
   these pages, and get an actual attorney review before scaling real
   payments (especially the liability limitation and auto-renewal language).
5. **Twilio + phone sign-in** — if/when ready to pay: create a Twilio
   account, buy a phone number, set up a Messaging Service (get its
   `MG...` Service SID), then enable the Phone provider in Supabase's Auth
   settings with those credentials. Re-enabling the UI is then just
   re-adding the `PhoneAuthForm` import + JSX back into `/login` and
   `/signup` (removed, not deleted — see [changelog.md](./changelog.md) #19).
6. **Customer acquisition — concrete, ready-to-execute items**:
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
7. **Twilio WhatsApp Business API** (separate from phone-auth SMS above) —
   still just discussed, never decided-and-shipped. Leaning toward *not*
   building the full integration and instead just storing a WhatsApp number +
   click-to-chat (`wa.me/`) link + the existing manual communication-log
   fallback.
8. **Google OAuth** is done. **Stripe live mode** still outstanding,
   untouched so far.
9. **Smaller open items carried over from before**: no automated test suite;
   "Delivered" PO badge uses steel not green (no green in the palette);
   Products link to Quotes/Samples/POs via text-matching, not a real foreign
   key; Agency-plan downgrade doesn't revoke already-created client
   workspaces (deliberate, "grandfather them" was the explicit decision); no
   "delete client workspace" UI; an existing single-workspace user can't also
   join a client workspace as an invited member (only fresh signups can,
   deliberate scope decision).
