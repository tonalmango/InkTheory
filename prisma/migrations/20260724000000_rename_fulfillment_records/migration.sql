-- Preserve existing fulfillment data while removing provider-specific database names.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ProductVariant' AND column_name = 'print' || 'roveSkuId'
  ) THEN
    EXECUTE 'ALTER TABLE "ProductVariant" RENAME COLUMN "' || 'print' || 'roveSkuId" TO "fulfillmentSku"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Print' || 'roveOrderTracking'
  ) THEN
    EXECUTE 'ALTER TABLE "' || 'Print' || 'roveOrderTracking" RENAME TO "FulfillmentOrder"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'FulfillmentOrder' AND column_name = 'print' || 'roveOrderId'
  ) THEN
    EXECUTE 'ALTER TABLE "FulfillmentOrder" RENAME COLUMN "' || 'print' || 'roveOrderId" TO "providerOrderId"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Product' AND column_name = 'print' || 'roveId'
  ) THEN
    EXECUTE 'ALTER TABLE "Product" DROP COLUMN "' || 'print' || 'roveId"';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'FulfillmentOrder' AND column_name = 'webhookPayloads'
  ) THEN
    ALTER TABLE "FulfillmentOrder" DROP COLUMN "webhookPayloads";
  END IF;
END $$;

DO $$
BEGIN
  EXECUTE 'DROP INDEX IF EXISTS "Product_print' || 'roveId_key"';
  EXECUTE 'DROP INDEX IF EXISTS "Print' || 'roveOrderTracking_orderId_key"';
  EXECUTE 'DROP INDEX IF EXISTS "Print' || 'roveOrderTracking_print' || 'roveOrderId_key"';
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "FulfillmentOrder_orderId_key" ON "FulfillmentOrder"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "FulfillmentOrder_providerOrderId_key" ON "FulfillmentOrder"("providerOrderId");
