-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_permitId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_tariffId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_vesselId_fkey";

-- AlterTable
ALTER TABLE "Harvests" ALTER COLUMN "harvestScale" DROP NOT NULL,
ALTER COLUMN "harvestDeliverMethod" DROP NOT NULL,
ALTER COLUMN "harvestWeightUnit" DROP NOT NULL,
ALTER COLUMN "vesselId" DROP NOT NULL,
ALTER COLUMN "departureDate" DROP NOT NULL,
ALTER COLUMN "tripStartDate" DROP NOT NULL,
ALTER COLUMN "tripEndDate" DROP NOT NULL,
ALTER COLUMN "landingDate" DROP NOT NULL,
ALTER COLUMN "tariffId" DROP NOT NULL,
ALTER COLUMN "harvestType" DROP NOT NULL,
ALTER COLUMN "permitId" DROP NOT NULL,
ALTER COLUMN "contactId" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "Tariffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "Permits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
