/*
  Warnings:

  - You are about to drop the column `mId` on the `VesselRegistration` table. All the data in the column will be lost.
  - You are about to drop the `IUUVessel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_vesselIUUId_fkey";

-- DropForeignKey
ALTER TABLE "IUUVessel" DROP CONSTRAINT "IUUVessel_countryId_fkey";

-- DropIndex
DROP INDEX "VesselRegistration_mId_key";

-- AlterTable
ALTER TABLE "VesselRegistration" DROP COLUMN "mId";

-- DropTable
DROP TABLE "IUUVessel";

-- CreateTable
CREATE TABLE "VesselIUU" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "alias" TEXT[],
    "IMO" TEXT,
    "IRCS" TEXT,
    "MMSI" TEXT,
    "nationalRegistry" TEXT,
    "countryId" BIGINT,
    "status" "VesselsIUUStatus" NOT NULL DEFAULT 'CURRENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselIUU_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VesselIUU_mId_key" ON "VesselIUU"("mId");

-- AddForeignKey
ALTER TABLE "VesselIUU" ADD CONSTRAINT "VesselIUU_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_vesselIUUId_fkey" FOREIGN KEY ("vesselIUUId") REFERENCES "VesselIUU"("id") ON DELETE SET NULL ON UPDATE CASCADE;
