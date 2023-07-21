/*
  Warnings:

  - Made the column `importId` on table `Harvests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_importId_fkey";

-- AlterTable
ALTER TABLE "Harvests" ALTER COLUMN "importId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Imports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
