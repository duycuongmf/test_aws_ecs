/*
  Warnings:

  - You are about to alter the column `customerId` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "customerId" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "Plans" (
    "id" BIGINT NOT NULL,
    "name" TEXT DEFAULT 'default',
    "description" VARCHAR(200),
    "price" DOUBLE PRECISION,
    "payment_service_id" VARCHAR(100),
    "currency" VARCHAR(30),
    "recurring_interval" VARCHAR(30),
    "type" VARCHAR(100),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "creatorId" BIGINT NOT NULL,
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);
