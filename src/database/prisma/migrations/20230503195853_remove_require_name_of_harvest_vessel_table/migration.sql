/*
  Warnings:

  - Made the column `harvestId` on table `HarvestProgram` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "HarvestProgram" DROP CONSTRAINT "HarvestProgram_harvestId_fkey";

-- AlterTable
ALTER TABLE "HarvestProgram" ALTER COLUMN "harvestId" SET NOT NULL;

-- AlterTable
ALTER TABLE "HarvestVessel" ALTER COLUMN "name" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HarvestProgram" ADD CONSTRAINT "HarvestProgram_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
