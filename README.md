# SourceOS

Sourcing/production manifest for DTC brand founders — suppliers, quotes, samples, and
purchase orders in one workspace. Next.js 16 (App Router) + Supabase + Stripe + Twilio.

## Stack

- **Frontend/API:** Next.js 16 (Turbopack, App Router, Server Actions)
- **Database + Auth:** Supabase (Postgres, RLS-enforced workspace isolation, email/password + Google OAuth)
- **Billing:** Stripe (Checkout + Billing Portal + webhooks)
- **WhatsApp:** Twilio WhatsApp Business API
- **Hosting:** Vercel

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. In the SQL editor, run the migrations in order: `supabase/migrations/0001_init.sql`, then
   `supabase/migrations/0002_waitlist.sql`.
3. Enable the Google provider under Authentication → Providers if you want Google sign-in.
4. Copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API.

### 3. Set up Stripe

1. Create three recurring Prices in the Stripe Dashboard (Starter $29/mo, Growth $79/mo,
   Agency $199/mo) and put their price IDs in `NEXT_PUBLIC_STRIPE_PRICE_*` in `.env.local`.
2. Copy your secret key into `STRIPE_SECRET_KEY`.
3. Add a webhook endpoint pointing at `<your-domain>/api/stripe/webhook` listening for
   `checkout.session.completed`, `customer.subscription.updated`, and
   `customer.subscription.deleted`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
   For local testing, use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

### 4. Set up Twilio WhatsApp (optional — the app works without it)

WhatsApp Business API approval is the longest lead-time item; the app is fully usable via the
manual communication-log entry on each supplier without it.

1. Apply for WhatsApp Business Platform access via Twilio and get a WhatsApp-enabled number.
2. Point the WhatsApp webhook at `<your-domain>/api/twilio/whatsapp`.
3. Fill in `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_WHATSAPP_NUMBER` in `.env.local`.

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Public pages (landing, login, signup) work
immediately; `/dashboard` requires the Supabase env vars above to be set.

## Deploying

Push to a Git repo and import it in Vercel. Add the same environment variables from
`.env.local` in the Vercel project settings, then point your Stripe and Twilio webhooks at the
deployed domain.
