/*
  Warnings:

  - You are about to drop the `StripeLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripeHistories" DROP CONSTRAINT "StripeHistories_stripeLogId_fkey";

-- DropTable
DROP TABLE "StripeLogs";

-- CreateTable
CREATE TABLE "StripeLog" (
    "id" BIGINT NOT NULL,
    "stripeId" VARCHAR(50),
    "customerId" VARCHAR(50),
    "event" VARCHAR(150),
    "json" TEXT,
    "is_active_user" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripeHistories" ADD CONSTRAINT "StripeHistories_stripeLogId_fkey" FOREIGN KEY ("stripeLogId") REFERENCES "StripeLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
