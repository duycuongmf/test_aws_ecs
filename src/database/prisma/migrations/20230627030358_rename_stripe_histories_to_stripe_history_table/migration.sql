/*
  Warnings:

  - You are about to drop the `StripeHistories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripeHistories" DROP CONSTRAINT "StripeHistories_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "StripeHistories" DROP CONSTRAINT "StripeHistories_stripeLogId_fkey";

-- DropTable
DROP TABLE "StripeHistories";

-- CreateTable
CREATE TABLE "StripeHistory" (
    "id" BIGINT NOT NULL,
    "stripeId" VARCHAR(50),
    "stripeLogId" BIGINT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "customerId" VARCHAR(50),
    "event" VARCHAR(150),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripeHistory" ADD CONSTRAINT "StripeHistory_stripeLogId_fkey" FOREIGN KEY ("stripeLogId") REFERENCES "StripeLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeHistory" ADD CONSTRAINT "StripeHistory_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
