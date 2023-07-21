/*
  Warnings:

  - You are about to drop the column `mId` on the `Harvests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_gearTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_harvestProgramId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_harvestVesselId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_productFormId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_speciesId_fkey";

-- DropIndex
DROP INDEX "Harvests_mId_key";

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "mId",
ALTER COLUMN "speciesId" DROP NOT NULL,
ALTER COLUMN "productFormId" DROP NOT NULL,
ALTER COLUMN "harvestVesselId" DROP NOT NULL,
ALTER COLUMN "gearTypeId" DROP NOT NULL,
ALTER COLUMN "harvestProgramId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_productFormId_fkey" FOREIGN KEY ("productFormId") REFERENCES "ProductForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_harvestVesselId_fkey" FOREIGN KEY ("harvestVesselId") REFERENCES "HarvestVessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_gearTypeId_fkey" FOREIGN KEY ("gearTypeId") REFERENCES "GearType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_harvestProgramId_fkey" FOREIGN KEY ("harvestProgramId") REFERENCES "HarvestProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
