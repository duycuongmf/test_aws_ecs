/*
  Warnings:

  - You are about to drop the column `contactId` on the `Harvests` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('NORMAL', 'DELIVERY');

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_contactId_fkey";

-- AlterTable
ALTER TABLE "Contacts" ADD COLUMN     "harvestId" BIGINT,
ADD COLUMN     "type" "ContactType" DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "contactId";

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
