/*
  Warnings:

  - You are about to drop the column `harvestDeliverMethod` on the `Harvests` table. All the data in the column will be lost.
  - You are about to drop the column `harvestDeliverMethodRef` on the `Harvests` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "HarvestDeliveryMethod" AS ENUM ('LAND', 'VESSEL');

-- CreateEnum
CREATE TYPE "HarvestDeliveryMethodRef" AS ENUM ('sEEZ', 'Contact');

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "harvestDeliverMethod",
DROP COLUMN "harvestDeliverMethodRef",
ADD COLUMN     "harvestDeliveryMethod" "HarvestDeliveryMethod" DEFAULT 'LAND',
ADD COLUMN     "harvestDeliveryMethodRef" "HarvestDeliveryMethodRef";

-- DropEnum
DROP TYPE "HarvestDeliverMethod";

-- DropEnum
DROP TYPE "HarvestDeliverMethodRef";
