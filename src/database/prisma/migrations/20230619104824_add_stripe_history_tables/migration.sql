-- CreateTable
CREATE TABLE "StripeHistories" (
    "id" BIGINT NOT NULL,
    "stripeLogId" BIGINT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "customerId" VARCHAR(50),
    "event" VARCHAR(150),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeHistories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripeHistories" ADD CONSTRAINT "StripeHistories_stripeLogId_fkey" FOREIGN KEY ("stripeLogId") REFERENCES "StripeLogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeHistories" ADD CONSTRAINT "StripeHistories_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
