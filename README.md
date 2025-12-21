# LunchBox - Food for Soul

A production-ready two-sided marketplace connecting certified home cooks with customers seeking authentic, home-cooked meals.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions + API Routes
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth (email + phone OTP)
- **Payments**: Stripe Checkout + Connect (Express accounts)
- **Storage**: Supabase Storage
- **Maps**: Mapbox
- **Email**: Resend
- **Analytics**: PostHog

## Features

### For Customers
- Browse verified home cooks by location
- Filter by cuisine, dietary requirements, price
- Real-time order tracking
- Saved addresses and payment methods
- Review and rating system
- Favorites and reordering

### For Cooks
- 10-step onboarding with verification
- Document upload (ID, food safety certificates)
- Menu management with photos
- Order management dashboard
- Earnings and payout tracking
- Stripe Connect integration
- Delivery radius settings

### For Admins
- Cook approval workflow
- Document verification
- Safety report management
- Order dispute resolution
- Analytics dashboard
- Audit logs

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- Mapbox account
- Resend account (optional)
- PostHog account (optional)

### 2. Clone and Install

```bash
cd Lunchbox
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# Resend
RESEND_API_KEY=re_...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_COMMISSION_PERCENT=15
```

### 4. Database Setup

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Copy the project URL and anon key to your `.env.local`

#### Run Migrations

In your Supabase project dashboard:

1. Go to SQL Editor
2. Create a new query
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the query
5. Repeat for `supabase/migrations/002_rls_policies.sql`

Alternatively, if you have Supabase CLI installed:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

#### Configure Storage Buckets

In Supabase Dashboard > Storage:

1. Create bucket: `cook-documents` (private)
2. Create bucket: `meal-photos` (public)
3. Create bucket: `avatars` (public)

Set up storage policies for each bucket to allow authenticated users to upload.

### 5. Stripe Setup

#### Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from Dashboard > Developers > API keys
3. Enable Stripe Connect:
   - Go to Connect > Settings
   - Choose "Express" account type
   - Configure branding and settings

#### Set Up Webhooks

Create two webhook endpoints:

**Standard Webhook** (for payments):
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`

**Connect Webhook** (for payouts):
- URL: `https://your-domain.com/api/webhooks/stripe-connect`
- Events: `account.updated`, `payout.paid`, `payout.failed`

Copy webhook secrets to `.env.local`

### 6. Mapbox Setup

1. Create account at [mapbox.com](https://mapbox.com)
2. Create a new token with appropriate scopes
3. Add token to `.env.local`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Seed Data (Optional)

To populate the database with sample cooks and meals, run:

```bash
npm run seed
```

## Project Structure

```
Lunchbox/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       ├── sign-in/
│   │       ├── sign-up/
│   │       └── verify/
│   ├── (customer)/
│   │   └── app/
│   │       ├── cart/
│   │       ├── checkout/
│   │       ├── orders/
│   │       └── profile/
│   ├── (cook)/
│   │   └── cook-dashboard/
│   │       ├── onboarding/
│   │       ├── menu/
│   │       ├── orders/
│   │       └── earnings/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── approvals/
│   │       ├── orders/
│   │       └── reports/
│   ├── (marketing)/
│   │   ├── cooks/
│   │   ├── menu/
│   │   ├── how-it-works/
│   │   ├── safety/
│   │   └── about/
│   ├── api/
│   │   ├── webhooks/
│   │   └── stripe/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   └── ...
├── lib/
│   ├── supabase/
│   ├── stripe/
│   └── utils.ts
├── supabase/
│   └── migrations/
├── middleware.ts
└── package.json
```

## Key Workflows

### Cook Onboarding

1. Sign up as cook
2. Complete 10-step checklist:
   - Profile setup
   - Identity verification
   - Food safety certificate
   - Kitchen details
   - Insurance
   - Stripe Connect
   - Menu creation
   - Delivery settings
   - Trial order
   - Submit for approval
3. Admin reviews and approves
4. Cook goes live

### Order Flow

1. Customer browses cooks/meals
2. Adds items to cart
3. Proceeds to checkout
4. Stripe payment processed
5. Order created in database
6. Cook receives notification
7. Cook accepts and prepares
8. Order status updates
9. Delivery/pickup
10. Customer reviews
11. Payout processed to cook

### Safety Reporting

1. Customer/cook reports issue
2. Report created in database
3. Admin notified
4. Admin investigates
5. Resolution logged
6. Audit trail maintained

## Testing

### Run Tests

```bash
npm test
```

### Test Stripe Webhooks Locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment

1. Update Stripe webhook URLs to production domain
2. Update Supabase redirect URLs
3. Test all critical flows
4. Monitor error logs

## Security Considerations

- All database access protected by RLS policies
- File uploads secured with signed URLs
- Stripe webhooks verified with signatures
- API routes protected with authentication
- Sensitive data encrypted at rest
- HTTPS enforced in production

## Compliance

- Food safety certificate verification
- Identity verification for cooks
- Insurance requirements
- Audit logs for all admin actions
- Safety incident reporting
- Certificate expiry tracking

## Support

For issues or questions:
- Check FAQ at `/faq`
- Email: support@lunchbox.com
- Safety concerns: safety@lunchbox.com

## License

Proprietary - All rights reserved