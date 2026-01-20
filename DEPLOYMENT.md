# LunchBox Deployment Guide

## ✅ Build Fixed!

All ESLint errors have been resolved. Your app is ready to deploy.

---

## 🚀 Deployment Steps (Vercel)

### Step 1: Push to GitHub

```bash
# Navigate to your project
cd C:\Users\kalra\lunchbox\Lunchbox

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - LunchBox marketplace"

# Create main branch
git branch -M main

# Add your GitHub repository (create one first at github.com)
git remote add origin https://github.com/YOUR_USERNAME/lunchbox.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"** with GitHub
3. Click **"Add New Project"**
4. Click **"Import"** next to your `lunchbox` repository
5. Vercel will auto-detect Next.js settings
6. **BEFORE clicking Deploy**, add environment variables (see Step 3)

### Step 3: Add Environment Variables in Vercel

Click **"Environment Variables"** and add these:

#### ✅ Required - Supabase (Get from Supabase Dashboard)

```
NEXT_PUBLIC_SUPABASE_URL
```
**Value:** `https://your-project.supabase.co`
**Where to find:** Supabase Dashboard → Settings → API → Project URL

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
**Where to find:** Supabase Dashboard → Settings → API → Project API keys → anon public

```
SUPABASE_SERVICE_ROLE_KEY
```
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
**Where to find:** Supabase Dashboard → Settings → API → Project API keys → service_role (click "Reveal")

#### ⚠️ Required Later - Stripe (Get from Stripe Dashboard)

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
**Value:** `pk_test_...` or `pk_live_...`
**Where to find:** Stripe Dashboard → Developers → API keys → Publishable key

```
STRIPE_SECRET_KEY
```
**Value:** `sk_test_...` or `sk_live_...`
**Where to find:** Stripe Dashboard → Developers → API keys → Secret key

```
STRIPE_WEBHOOK_SECRET
```
**Value:** `whsec_...`
**Where to find:** Stripe Dashboard → Developers → Webhooks → Add endpoint → Copy signing secret

```
STRIPE_CONNECT_WEBHOOK_SECRET
```
**Value:** `whsec_...`
**Where to find:** Same as above but for Connect webhook

#### 📍 Optional - Mapbox

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
```
**Value:** `pk.eyJ1...`
**Where to find:** Mapbox Dashboard → Access tokens

#### 📧 Optional - Resend

```
RESEND_API_KEY
```
**Value:** `re_...`
**Where to find:** Resend Dashboard → API Keys

#### 📊 Optional - PostHog

```
NEXT_PUBLIC_POSTHOG_KEY
```
**Value:** `phc_...`
**Where to find:** PostHog Dashboard → Project Settings → Project API Key

```
NEXT_PUBLIC_POSTHOG_HOST
```
**Value:** `https://app.posthog.com`

#### 🔧 App Settings

```
NEXT_PUBLIC_APP_URL
```
**Value:** `https://your-app.vercel.app` (you'll get this after first deploy)

```
PLATFORM_COMMISSION_PERCENT
```
**Value:** `15`

### Step 4: Deploy

1. After adding environment variables, click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://lunchbox-git-main-yourname.vercel.app`

### Step 5: Update Supabase Settings

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication → URL Configuration**
3. Add these redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/**`
4. Save changes

### Step 6: Set Up Stripe Webhooks (When Ready)

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **"Add endpoint"**

**Webhook 1 - Payments:**
- **Endpoint URL:** `https://your-app.vercel.app/api/webhooks/stripe`
- **Events to send:**
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `charge.refunded`
- Click **"Add endpoint"**
- Copy the **Signing secret** (starts with `whsec_`)
- Add it to Vercel as `STRIPE_WEBHOOK_SECRET`

**Webhook 2 - Connect:**
- **Endpoint URL:** `https://your-app.vercel.app/api/webhooks/stripe-connect`
- **Events to send:**
  - `account.updated`
  - `payout.paid`
  - `payout.failed`
- Click **"Add endpoint"**
- Copy the **Signing secret**
- Add it to Vercel as `STRIPE_CONNECT_WEBHOOK_SECRET`

### Step 7: Update Environment Variable

1. Go back to **Vercel Dashboard**
2. Click your project → **Settings → Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

---

## 🎯 Quick Start Checklist

### Minimum to Deploy (Just to see it live):

- [x] Push code to GitHub
- [x] Connect to Vercel
- [ ] Add Supabase URL (3 variables)
- [ ] Click Deploy

### To Make It Functional:

- [ ] Add Stripe keys (4 variables)
- [ ] Set up Stripe webhooks (2 endpoints)
- [ ] Update Supabase redirect URLs
- [ ] Run database migrations in Supabase
- [ ] Create storage buckets in Supabase

### Optional Enhancements:

- [ ] Add Mapbox for address search
- [ ] Add Resend for emails
- [ ] Add PostHog for analytics
- [ ] Set up custom domain

---

## 📋 Getting Your API Keys

### Supabase Keys (Required)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) in sidebar
4. Click **API**
5. Copy:
   - Project URL
   - anon public key
   - service_role key (click "Reveal")

### Stripe Keys (Required for payments)

1. Go to: https://dashboard.stripe.com
2. Click **Developers** in top nav
3. Click **API keys**
4. Copy:
   - Publishable key (starts with `pk_test_` or `pk_live_`)
   - Secret key (starts with `sk_test_` or `sk_live_`)

### Mapbox Token (Optional)

1. Go to: https://account.mapbox.com
2. Click **Access tokens**
3. Create new token or copy existing
4. Copy token (starts with `pk.`)

### Resend API Key (Optional)

1. Go to: https://resend.com/api-keys
2. Create new API key
3. Copy key (starts with `re_`)

### PostHog Key (Optional)

1. Go to: https://app.posthog.com
2. Click **Project Settings**
3. Copy **Project API Key** (starts with `phc_`)

---

## 🐛 Troubleshooting

### Build Fails

- Check build logs in Vercel
- Ensure all environment variables are set
- Make sure you pushed latest code to GitHub

### App Loads but Auth Doesn't Work

- Verify Supabase keys are correct
- Check Supabase redirect URLs are set
- Ensure `.env.local` has same values as Vercel

### Payments Don't Work

- Verify Stripe keys are correct
- Check webhook endpoints are set up
- Test with Stripe test cards first

### Database Errors

- Run migrations in Supabase SQL Editor
- Check RLS policies are enabled
- Verify service role key is set

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Check Supabase logs
4. Check Stripe webhook logs

---

## 🎉 You're Ready!

Once you complete Step 1-4, your app will be live at:
**https://your-app.vercel.app**

The rest can be configured as you need features!
