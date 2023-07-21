-- AlterTable
ALTER TABLE "Harvests" ADD COLUMN     "harvestDeliveryVesselCountryId" BIGINT,
ADD COLUMN     "harvestDeliveryVesselName" VARCHAR(500);

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_harvestDeliveryVesselCountryId_fkey" FOREIGN KEY ("harvestDeliveryVesselCountryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
