/*
  Warnings:

  - You are about to drop the `Fisherys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FisheryCatair" DROP CONSTRAINT "FisheryCatair_fisheryId_fkey";

-- DropForeignKey
ALTER TABLE "FisheryEEZ" DROP CONSTRAINT "FisheryEEZ_fisheryId_fkey";

-- DropForeignKey
ALTER TABLE "FisheryFAO" DROP CONSTRAINT "FisheryFAO_fisheryId_fkey";

-- DropForeignKey
ALTER TABLE "FisheryGearType" DROP CONSTRAINT "FisheryGearType_fisheryId_fkey";

-- DropForeignKey
ALTER TABLE "FisheryRMFO" DROP CONSTRAINT "FisheryRMFO_fisheryId_fkey";

-- DropForeignKey
ALTER TABLE "Fisherys" DROP CONSTRAINT "Fisherys_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Fisherys" DROP CONSTRAINT "Fisherys_speciesId_fkey";

-- DropTable
DROP TABLE "Fisherys";

-- CreateTable
CREATE TABLE "Fisheries" (
    "id" BIGINT NOT NULL,
    "fisheryId" VARCHAR(200),
    "loffId" VARCHAR(200),
    "speciesId" BIGINT,
    "countryId" BIGINT,
    "highSeas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fisheries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fisheries" ADD CONSTRAINT "Fisheries_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fisheries" ADD CONSTRAINT "Fisheries_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryRMFO" ADD CONSTRAINT "FisheryRMFO_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisheries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryEEZ" ADD CONSTRAINT "FisheryEEZ_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisheries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryGearType" ADD CONSTRAINT "FisheryGearType_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisheries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryCatair" ADD CONSTRAINT "FisheryCatair_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisheries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryFAO" ADD CONSTRAINT "FisheryFAO_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisheries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
