/*
  Warnings:

  - You are about to drop the `UsedServices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsedServices" DROP CONSTRAINT "UsedServices_creatorId_fkey";

-- DropTable
DROP TABLE "UsedServices";

-- CreateTable
CREATE TABLE "StripeUsageSubsciption" (
    "id" BIGINT NOT NULL,
    "quantity" INTEGER DEFAULT 0,
    "module" VARCHAR(50),
    "action" VARCHAR(50),
    "creatorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeUsageSubsciption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripeUsageSubsciption" ADD CONSTRAINT "StripeUsageSubsciption_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
