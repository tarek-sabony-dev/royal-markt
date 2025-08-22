This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# royal-markt

## Shopify Webhook Setup (Orders Create)

This app can capture Shopify order creation events and append them to `src/data/orders.json`.

### 1) Configure environment variable

Create `.env.local` in the project root and set:

```
SHOPIFY_WEBHOOK_SECRET=your_webhook_shared_secret
```

Restart the dev server after changing env vars.

### 2) Expose your local dev server and register the webhook

- Start your app: `npm run dev` (defaults to `http://localhost:3000`)
- Expose it with a tunnel, e.g. using `ngrok`:

```
ngrok http 3000
```

- In your Shopify admin/app settings, add a webhook:
  - Topic: Orders Create
  - URL: `https://YOUR_TUNNEL_DOMAIN/api/webhooks/orders/create`
  - Secret: same as `SHOPIFY_WEBHOOK_SECRET`

The endpoint verifies the `X-Shopify-Hmac-Sha256` header using your secret and, on success, appends the order payload to `src/data/orders.json`.

### 3) View the dashboard

- Visit `/dashboard` to see a table of orders loaded from `/api/orders`.

### Notes

- This is intended for development: local JSON storage uses a simple read-modify-write.
- For production, use a database and implement proper concurrency and retries.
- The webhook route runs on the Node.js runtime and reads the raw request body for HMAC verification.
