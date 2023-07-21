/*
  Warnings:

  - You are about to drop the column `harvestVesselId` on the `Harvests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[harvestId]` on the table `HarvestVessel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_harvestVesselId_fkey";

-- AlterTable
ALTER TABLE "HarvestVessel" ADD COLUMN     "harvestId" BIGINT;

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "harvestVesselId";

-- CreateIndex
CREATE UNIQUE INDEX "HarvestVessel_harvestId_key" ON "HarvestVessel"("harvestId");

-- AddForeignKey
ALTER TABLE "HarvestVessel" ADD CONSTRAINT "HarvestVessel_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
