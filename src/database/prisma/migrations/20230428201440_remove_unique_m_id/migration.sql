-- DropIndex
DROP INDEX "Address_mId_key";

-- DropIndex
DROP INDEX "Catairs_mId_key";

-- DropIndex
DROP INDEX "Contracts_mId_key";

-- DropIndex
DROP INDEX "Countries_mId_key";

-- DropIndex
DROP INDEX "Details_mId_key";

-- DropIndex
DROP INDEX "EEZs_mId_key";

-- DropIndex
DROP INDEX "FAOs_mId_key";

-- DropIndex
DROP INDEX "GearType_mId_key";

-- DropIndex
DROP INDEX "HarvestProgram_mId_key";

-- DropIndex
DROP INDEX "HarvestVessel_mId_key";

-- DropIndex
DROP INDEX "Permits_mId_key";

-- DropIndex
DROP INDEX "ProductForm_mId_key";

-- DropIndex
DROP INDEX "Programs_mId_key";

-- DropIndex
DROP INDEX "RFMO_mId_key";

-- DropIndex
DROP INDEX "Rules_mId_key";

-- DropIndex
DROP INDEX "Species_mId_key";

-- DropIndex
DROP INDEX "Tariffs_mId_key";

-- DropIndex
DROP INDEX "VesselIUU_mId_key";

-- DropIndex
DROP INDEX "Vessels_mId_key";

-- DropIndex
DROP INDEX "Visible_mId_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Catairs" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Contracts" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Countries" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Details" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Documents" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EEZs" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FAOs" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GearType" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HarvestProgram" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HarvestVessel" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Harvests" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Imports" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Permits" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductForm" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Programs" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RFMO" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Rules" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Species" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tariffs" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VesselIUU" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vessels" ALTER COLUMN "mId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Visible" ALTER COLUMN "mId" DROP NOT NULL;
