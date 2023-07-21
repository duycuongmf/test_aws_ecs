/*
  Warnings:

  - You are about to drop the `Plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Plans";

-- CreateTable
CREATE TABLE "StripePlans" (
    "id" BIGINT NOT NULL,
    "name" TEXT DEFAULT 'default',
    "description" VARCHAR(200),
    "price" DOUBLE PRECISION,
    "paymentServiceId" VARCHAR(100),
    "currency" VARCHAR(30),
    "recurringInterval" VARCHAR(30),
    "type" VARCHAR(100),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "creatorId" BIGINT NOT NULL,
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StripePlans_pkey" PRIMARY KEY ("id")
);
