# InkTheory - Modern Indian Streetwear

Next.js storefront for modern Indian streetwear inspired by culture, chaos and everyday stories, with Printrove fulfillment, PayPal checkout, account orders, coupons, cart, wishlist, admin tools, and email notifications.

## Setup

```bash
npm install
cp .env.example .env.local
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Required Credentials

Add these to `.env.local` before testing full checkout and fulfillment:

```bash
DATABASE_URL=""
DIRECT_URL=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
AUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED="false"

PAYPAL_ENVIRONMENT="sandbox"
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
PAYPAL_CURRENCY="INR"
NEXT_PUBLIC_PAYPAL_CLIENT_ID=""
NEXT_PUBLIC_PAYPAL_CURRENCY="INR"

PRINTROVE_API_URL="https://api.printrove.com"
PRINTROVE_EMAIL=""
PRINTROVE_PASSWORD=""
PRINTROVE_SYNC_SOURCE="product-library"
PRINTROVE_SYNC_CATEGORY_IDS=""
PRINTROVE_DEFAULT_FRONT_DESIGN_ID=""
PRINTROVE_DEFAULT_BACK_DESIGN_ID=""
PRINTROVE_DESIGN_WIDTH="3000"
PRINTROVE_DESIGN_HEIGHT="3000"
PRINTROVE_DESIGN_TOP="10"
PRINTROVE_DESIGN_LEFT="50"
PRINTROVE_DEFAULT_COURIER_ID=""
PRINTROVE_COD="false"
PRINTROVE_WEBHOOK_SECRET=""

RESEND_API_KEY=""
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="InkTheory <noreply@inktheory.in>"
CONTACT_TO_EMAIL="support@inktheory.in"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="InkTheory"
```

Set `PRINTROVE_EMAIL` and `PRINTROVE_PASSWORD` to your Printrove merchant credentials. The app uses Printrove's Authentication API (`POST /api/external/token`) to generate the bearer token automatically. Keep `PRINTROVE_SYNC_SOURCE` as `product-library` when you create designed products inside Printrove. Use `catalog` only if you want this app to combine catalog products with global design IDs from Printrove's Design Library API.

## Vercel Deployment

1. Push this folder to GitHub.
2. Import the repository into Vercel as a Next.js project.
3. Add every value from `.env.local` into Vercel Project Settings > Environment Variables.
4. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URL.
5. Add this Google OAuth redirect URI in Google Cloud:

```text
https://your-domain.vercel.app/api/auth/callback/google
```

6. Verify your sending domain in Resend before replacing `onboarding@resend.dev`.
7. Run `npx prisma db push` once for the production database if the schema is not already synced.

Secrets are ignored by `.gitignore`; do not commit `.env` or `.env.local`.

## Payment Flow

```text
User adds items -> Cart -> Checkout
-> POST /api/checkout/paypal/create-order
-> PayPal checkout button opens
-> User pays with PayPal, card, or UPI if enabled on the PayPal account
-> POST /api/checkout/paypal/capture
-> Order marked PAID
-> submitOrderToPrintrove() runs asynchronously
-> Confirmation email is sent
```

## Fulfillment Flow

```text
Order paid
-> submitOrderToPrintrove() sends order to Printrove
-> Printrove processes and prints
-> Printrove webhook POSTs to /api/webhooks/printrove
-> Order status and tracking update in the account/admin views
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:push
npm run db:migrate
npm run db:studio
npm run db:seed
```

## Seed Admin

```text
Email: admin@inktheory.in
Password: admin@InkTheory123
```

Sample coupons:

```text
InkTheory10 - 10% off above INR 1000
FIRST200 - INR 200 off above INR 1500
```
