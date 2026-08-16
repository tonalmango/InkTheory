# InkTheory Streetwear

Next.js storefront with PayPal checkout, account orders, coupons, cart, wishlist, admin tools, email notifications, and Qikink fulfillment.

## Qikink

Set the following server-side environment variables:

```env
QIKINK_ENVIRONMENT="sandbox"
QIKINK_CLIENT_ID=""
QIKINK_CLIENT_SECRET=""
# Optional override. Leave blank to use the selected environment's default API URL.
QIKINK_BASE_URL=""
# Reserved for deployment-managed credentials; tokens are obtained and cached automatically.
QIKINK_ACCESS_TOKEN=""
```

`QIKINK_ENVIRONMENT=sandbox` uses the Sandbox API; setting it to `live` switches to the live API. The integration uses `POST /api/token` and `POST /api/order/create` through `lib/qikink`.

To submit a Sandbox test order, also set the `QIKINK_TEST_*` variables used by [`scripts/qikink-test.ts`](scripts/qikink-test.ts), then run:

```bash
npm run qikink:test
```

The test authenticates, creates one Sandbox order, and prints its order ID. Use only test customer data and publicly reachable design/mockup URLs.

Apply database migrations in deployed environments with:

```bash
npm run db:migrate:deploy
```
