# Things That Failed (and resolution)

*(part of the [handoff folder](./README.md))*

- **Proxy redirecting webhooks** — see [changelog.md](./changelog.md) #4.
- **SQL migration paste mistake** — resolved by giving exact SQL directly in
  chat instead of pointing to a file path (still the preferred method for
  every migration since — see `.claude` session history).
- **Migrations run out of order** — the app degrades gracefully when a table
  is missing (queries only destructure `data`, not `error`), but be
  deliberate about order regardless.
- **Supabase's default auth email hit its rate limit** during testing —
  motivated the whole custom-domain + Resend SMTP effort, currently blocked
  on the Squarespace DNS issue below.
- **Squarespace DNS not syncing to the live GoDaddy-backed zone** — records
  correctly entered and saved in Squarespace's panel did not appear when
  querying the domain's actual authoritative nameservers directly, even after
  a delete-and-re-add cycle. Not a user error — confirmed via direct
  `nslookup` against `ns65.domaincontrol.com`. Squarespace support was
  contacted and quoted 24-48h propagation; genuinely unresolved as of this
  handoff, not just "still propagating" in the normal sense (see
  [current-state.md](./current-state.md) → In Progress for exact next
  diagnostic step).
- **`profiles` RLS column gap** — see [changelog.md](./changelog.md) #12. A
  real, pre-existing security bug (not introduced in the session that found
  it, but found and fixed in that session) that would have let any signed-in
  user self-assign into any workspace whose ID they knew, bypassing the
  invite/join-code flow's member-limit checks entirely.
- **Landing page had its own stale copy of the pricing feature list** —
  fixing the in-app billing page's fake-AI-features copy didn't fix the
  public marketing page, which had an independent hardcoded `PRICING` array.
  Worth checking for this kind of duplication pattern elsewhere if pricing
  ever changes again.
- **In-session browser automation flakiness** persisted from earlier —
  verification for backend/schema-heavy work continued to lean on direct
  `nslookup`/`fetch`/localStorage checks and type-check/build rather than
  screenshots where a login was required, since the assistant does not enter
  passwords into login forms under any circumstances (a hard rule, not a
  workaround) — the human always did test-account logins/checks personally.
- **The domain typo — a multi-session misdiagnosis, fully resolved
  2026-07-24.** For days across multiple sessions, DNS troubleshooting
  targeted `sourceos.com` — checking, re-checking, escalating to Squarespace
  support, building an entire "Squarespace DNS panel isn't syncing to the
  live zone" theory to explain why records kept showing as foreign/stale no
  matter what was changed. The actual registered domain was `souceos.com`
  (missing the "r") the entire time — `sourceos.com` belongs to an unrelated
  third party (registered 2013, confirmed via whois, actively used — that's
  why it always showed a real business's Barracuda/Outlook mail
  configuration). There was **no Squarespace bug at all**. Squarespace
  support's repeated claims of "everything is detected as configured" were
  actually true the whole time, just for the domain that was really owned.
  **Lesson for future sessions**: when a user references "our domain" by
  name, verify it actually matches what's registered in their account before
  spending significant troubleshooting time — don't assume a name given
  early in conversation is correct without confirming it against the actual
  account/panel.
- **Google OAuth 400 error** — see [changelog.md](./changelog.md) #18. Root
  cause was simply that the provider was never enabled in Supabase, despite
  the sign-in button already existing in the UI from an earlier session.
- **Dashboard multi-second navigation latency** — see
  [changelog.md](./changelog.md) #20 for the three-part root cause (no
  loading state, a redundant sequential DB query, wrong Vercel region).
- **Reddit's "no AI-generated content" rule** — discovered only after
  drafting a reply and getting user approval to post it, by noticing the
  subreddit's sidebar rules while attempting to fill in the comment box.
  **Lesson for future sessions**: check a subreddit's posted rules *before*
  drafting content for it, not after — this cost a full drafting cycle that
  had to be redone by the user personally instead.
- **LinkedIn cold outreach via search — not a bug, but a real channel
  limitation worth recording.** Content search is dominated by sourcing
  agencies/consultants who SEO-optimize around the exact keywords a genuine
  founder's post would use, and people search is restricted to 3rd-degree
  connections without a paid LinkedIn tier (this account has only 2
  connections). Concluded this channel isn't productive right now without
  either an existing network or a paid upgrade — don't keep retrying the
  same keyword-search approach in future sessions without one of those two
  changing.
