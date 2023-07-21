/*
  Warnings:

  - You are about to drop the column `permitId` on the `Harvests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_permitId_fkey";

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "permitId",
ADD COLUMN     "eezId" BIGINT,
ADD COLUMN     "faoId" BIGINT,
ADD COLUMN     "rfmoId" BIGINT;

-- AlterTable
ALTER TABLE "Permits" ADD COLUMN     "harvestId" BIGINT;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_eezId_fkey" FOREIGN KEY ("eezId") REFERENCES "EEZs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_faoId_fkey" FOREIGN KEY ("faoId") REFERENCES "FAOs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_rfmoId_fkey" FOREIGN KEY ("rfmoId") REFERENCES "RFMO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permits" ADD CONSTRAINT "Permits_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
