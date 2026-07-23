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
