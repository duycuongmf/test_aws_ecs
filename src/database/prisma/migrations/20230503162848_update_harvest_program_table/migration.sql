/*
  Warnings:

  - You are about to drop the column `mId` on the `HarvestProgram` table. All the data in the column will be lost.
  - You are about to drop the column `mId` on the `HarvestVessel` table. All the data in the column will be lost.
  - You are about to drop the column `harvestProgramId` on the `Harvests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[harvestId]` on the table `HarvestProgram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `HarvestProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `HarvestProgram` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_harvestProgramId_fkey";

-- AlterTable
ALTER TABLE "HarvestProgram" DROP COLUMN "mId",
ADD COLUMN     "creatorId" BIGINT NOT NULL,
ADD COLUMN     "harvestId" BIGINT,
ADD COLUMN     "organizationId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "HarvestVessel" DROP COLUMN "mId";

-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "harvestProgramId";

-- CreateIndex
CREATE UNIQUE INDEX "HarvestProgram_harvestId_key" ON "HarvestProgram"("harvestId");

-- AddForeignKey
ALTER TABLE "HarvestProgram" ADD CONSTRAINT "HarvestProgram_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestProgram" ADD CONSTRAINT "HarvestProgram_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestProgram" ADD CONSTRAINT "HarvestProgram_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
