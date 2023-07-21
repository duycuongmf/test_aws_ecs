/*
  Warnings:

  - You are about to drop the column `harvestDeliverEEZId` on the `Harvests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_harvestDeliverEEZId_fkey";

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "harvestDeliverEEZId",
ADD COLUMN     "harvestDeliveryEEZId" BIGINT;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_harvestDeliveryEEZId_fkey" FOREIGN KEY ("harvestDeliveryEEZId") REFERENCES "EEZs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
