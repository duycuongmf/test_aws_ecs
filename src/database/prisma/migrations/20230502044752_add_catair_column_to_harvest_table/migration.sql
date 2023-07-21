-- AlterTable
ALTER TABLE "Harvests" ADD COLUMN     "catairId" BIGINT;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_catairId_fkey" FOREIGN KEY ("catairId") REFERENCES "Catairs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
