-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "chargeCreated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "chargeId" VARCHAR(50),
ADD COLUMN     "chargeStatus" VARCHAR(50),
ADD COLUMN     "subscriptionCreated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscriptionStatus" VARCHAR(50);
