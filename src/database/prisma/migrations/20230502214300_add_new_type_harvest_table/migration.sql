/*
  Warnings:

  - You are about to drop the column `fishingPermitAgency` on the `Harvests` table. All the data in the column will be lost.
  - You are about to drop the column `fishingPermitNumber` on the `Harvests` table. All the data in the column will be lost.
  - You are about to drop the column `isLargeFarmHarvest` on the `Harvests` table. All the data in the column will be lost.
  - You are about to drop the column `isLargeWildHarvest` on the `Harvests` table. All the data in the column will be lost.
  - You are about to drop the column `isSmallFarmHarvest` on the `Harvests` table. All the data in the column will be lost.
  - You are about to drop the column `isSmallWildHarvest` on the `Harvests` table. All the data in the column will be lost.
  - The `totalSmallVessels` column on the `Harvests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TypeFarmHarvest" AS ENUM ('SMALL', 'LARGE');

-- CreateEnum
CREATE TYPE "TypeWildHarvest" AS ENUM ('SMALL', 'LARGE');

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "fishingPermitAgency",
DROP COLUMN "fishingPermitNumber",
DROP COLUMN "isLargeFarmHarvest",
DROP COLUMN "isLargeWildHarvest",
DROP COLUMN "isSmallFarmHarvest",
DROP COLUMN "isSmallWildHarvest",
ADD COLUMN     "isDolphinSafe" BOOLEAN,
ADD COLUMN     "typeFarmHarvest" "TypeFarmHarvest" DEFAULT 'SMALL',
ADD COLUMN     "typeWildHarvest" "TypeWildHarvest" DEFAULT 'SMALL',
DROP COLUMN "totalSmallVessels",
ADD COLUMN     "totalSmallVessels" INTEGER;
