/*
  Warnings:

  - The `harvestScale` column on the `Harvests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "harvestScale",
ADD COLUMN     "harvestScale" TEXT;
