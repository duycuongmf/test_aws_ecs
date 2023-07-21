/*
  Warnings:

  - You are about to drop the `StripeHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeUsageSubsciption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripeHistory" DROP CONSTRAINT "StripeHistory_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "StripeHistory" DROP CONSTRAINT "StripeHistory_stripeLogId_fkey";

-- DropForeignKey
ALTER TABLE "StripeUsageSubsciption" DROP CONSTRAINT "StripeUsageSubsciption_creatorId_fkey";

-- DropTable
DROP TABLE "StripeHistory";

-- DropTable
DROP TABLE "StripeLog";

-- DropTable
DROP TABLE "StripeUsageSubsciption";

-- CreateTable
CREATE TABLE "StripeLogs" (
    "id" BIGINT NOT NULL,
    "stripeId" VARCHAR(50),
    "customerId" VARCHAR(50),
    "event" VARCHAR(150),
    "json" TEXT,
    "is_active_user" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeHistories" (
    "id" BIGINT NOT NULL,
    "stripeId" VARCHAR(50),
    "stripeLogId" BIGINT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "customerId" VARCHAR(50),
    "event" VARCHAR(150),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeHistories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeUsageSubscriptions" (
    "id" BIGINT NOT NULL,
    "quantity" INTEGER DEFAULT 0,
    "module" VARCHAR(50),
    "action" VARCHAR(50),
    "creatorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeUsageSubscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripeHistories" ADD CONSTRAINT "StripeHistories_stripeLogId_fkey" FOREIGN KEY ("stripeLogId") REFERENCES "StripeLogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeHistories" ADD CONSTRAINT "StripeHistories_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeUsageSubscriptions" ADD CONSTRAINT "StripeUsageSubscriptions_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
