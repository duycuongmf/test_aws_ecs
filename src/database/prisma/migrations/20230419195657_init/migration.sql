-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('ISSUED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('CONDITIONALLY', 'TRUE');

-- CreateEnum
CREATE TYPE "VesselsIUUStatus" AS ENUM ('CURRENT', 'PAST');

-- CreateEnum
CREATE TYPE "ProductFormat" AS ENUM ('FRESH', 'FROZEN');

-- CreateEnum
CREATE TYPE "HarvestType" AS ENUM ('WILD', 'FARM');

-- CreateEnum
CREATE TYPE "HarvestWeightUnit" AS ENUM ('KG', 'LBS');

-- CreateEnum
CREATE TYPE "HarvestScale" AS ENUM ('SMALL', 'LARGE');

-- CreateEnum
CREATE TYPE "HarvestDeliverMethod" AS ENUM ('LAND', 'VESSEL');

-- CreateEnum
CREATE TYPE "HarvestDeliverMethodRef" AS ENUM ('sEEZ', 'Contact');

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "id" BIGINT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'ISSUED',
    "userId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'ISSUED',
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grants" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "organizationId" BIGINT NOT NULL,
    "roleId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Catairs" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Catairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contracts" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "address" VARCHAR(300),
    "unit" VARCHAR(50),
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "zipcode" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(100),
    "contactId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMethod" (
    "id" BIGINT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "value" VARCHAR(500),
    "contactId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Countries" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "mid" TEXT[],
    "alpha2" VARCHAR(300),
    "alpha3" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EEZs" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EEZs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAOs" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAOs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fisherys" (
    "id" BIGINT NOT NULL,
    "fisheryId" VARCHAR(200),
    "loffId" VARCHAR(200),
    "speciesId" BIGINT,
    "countryId" BIGINT,
    "highSeas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fisherys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearType" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "code" VARCHAR(5) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "type" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GearType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imports" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "exportFromId" BIGINT NOT NULL,
    "importToId" BIGINT NOT NULL,
    "identifier" VARCHAR(150),
    "organizationId" BIGINT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "fulfilled" BOOLEAN NOT NULL DEFAULT false,
    "harvestId" BIGINT,
    "organizationId" BIGINT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Harvests" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "speciesId" BIGINT NOT NULL,
    "productFormId" BIGINT NOT NULL,
    "productFromat" "ProductFormat" NOT NULL DEFAULT 'FROZEN',
    "productState" VARCHAR(300),
    "harvestScale" "HarvestScale" NOT NULL DEFAULT 'SMALL',
    "harvestDeliverMethod" "HarvestDeliverMethod" NOT NULL DEFAULT 'LAND',
    "harvestDeliverMethodRef" "HarvestDeliverMethodRef",
    "harvestWeightUnit" "HarvestWeightUnit" NOT NULL DEFAULT 'LBS',
    "harvestWeightValue" VARCHAR(300),
    "productDescription" VARCHAR(300),
    "isSmallVessel" BOOLEAN,
    "totalSmallVessels" VARCHAR(300),
    "vesselId" BIGINT NOT NULL,
    "harvestVesselId" BIGINT NOT NULL,
    "fishingPermitNumber" VARCHAR(300),
    "fishingPermitAgency" VARCHAR(300),
    "gearTypeId" BIGINT NOT NULL,
    "landingType" VARCHAR(300),
    "landingTypeDetails" JSONB,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "tripStartDate" TIMESTAMP(3) NOT NULL,
    "tripEndDate" TIMESTAMP(3) NOT NULL,
    "landingDate" TIMESTAMP(3) NOT NULL,
    "tariffId" BIGINT NOT NULL,
    "harvestType" "HarvestType" NOT NULL DEFAULT 'WILD',
    "harvestProgramId" BIGINT NOT NULL,
    "programs" JSONB,
    "importId" BIGINT,
    "permitId" BIGINT NOT NULL,
    "isSmallFarmHarvest" BOOLEAN,
    "totalFarms" INTEGER,
    "isLargeFarmHarvest" BOOLEAN,
    "contactId" BIGINT NOT NULL,
    "isSmallWildHarvest" BOOLEAN,
    "totalVessels" INTEGER,
    "isLargeWildHarvest" BOOLEAN,
    "facility" JSONB,
    "conditionalData" JSONB,
    "organizationId" BIGINT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Harvests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestVessel" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "imo" VARCHAR(300),
    "mmsi" VARCHAR(300),
    "ircs" VARCHAR(300),
    "rfmo" VARCHAR(300),
    "status" VARCHAR(100),
    "flagId" BIGINT,
    "organizationId" BIGINT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HarvestVessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestProgram" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "simpHarvestAuthorizationBody" VARCHAR(3000) NOT NULL,
    "simpHarvestAuthorizationRFMOId" BIGINT,
    "simpHarvestAuthorizationCountryId" BIGINT,
    "ttvp" JSONB,
    "coa" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HarvestProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programs" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductForm" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFMO" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFMO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rules" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "condition" VARCHAR(100) NOT NULL,
    "event" JSONB NOT NULL,
    "requirements" JSONB[],
    "notices" JSONB[],
    "programId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Species" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300),
    "scientificName" VARCHAR(300) NOT NULL,
    "taxonomyCode" VARCHAR(200) NOT NULL,
    "alpha3" VARCHAR(5) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tariffs" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "footnotes" VARCHAR(200),
    "quotaQuantity" VARCHAR(200),
    "other" VARCHAR(200),
    "indent" VARCHAR(200),
    "superior" VARCHAR(200),
    "chapter" VARCHAR(5),
    "heading" VARCHAR(5),
    "chapterHeading" VARCHAR(10),
    "subheading" VARCHAR(5),
    "tariffRate" VARCHAR(5),
    "statisticalSuffix" VARCHAR(5),
    "fullNonDelimited" VARCHAR(200),
    "fullDelimited" VARCHAR(200),
    "description" TEXT,
    "fullDescription" TEXT[],
    "special" VARCHAR(200),
    "htsno" VARCHAR(200),
    "units" VARCHAR(200),
    "general" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vessels" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "IMO" TEXT,
    "IRCS" TEXT,
    "MMSI" TEXT,
    "nationalRegistry" TEXT,
    "countryId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vessels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IUUVessel" (
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

    CONSTRAINT "IUUVessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VesselRegistration" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "vesselId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VesselRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Details" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "url" VARCHAR(100),
    "name" VARCHAR(300),
    "vesselIUUId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visible" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "condition" "Condition",
    "ruleId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permits" (
    "id" BIGINT NOT NULL,
    "mId" TEXT NOT NULL,
    "issuer" VARCHAR(300) NOT NULL,
    "value" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EEZCatair" (
    "catairId" BIGINT NOT NULL,
    "eezId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EEZCatair_pkey" PRIMARY KEY ("catairId","eezId")
);

-- CreateTable
CREATE TABLE "EEZRMFO" (
    "rfmoId" BIGINT NOT NULL,
    "eezId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EEZRMFO_pkey" PRIMARY KEY ("rfmoId","eezId")
);

-- CreateTable
CREATE TABLE "EEZCountry" (
    "countryId" BIGINT NOT NULL,
    "eezId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EEZCountry_pkey" PRIMARY KEY ("eezId","countryId")
);

-- CreateTable
CREATE TABLE "FisheryRMFO" (
    "rfmoId" BIGINT NOT NULL,
    "fisheryId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FisheryRMFO_pkey" PRIMARY KEY ("rfmoId","fisheryId")
);

-- CreateTable
CREATE TABLE "FisheryEEZ" (
    "eezId" BIGINT NOT NULL,
    "fisheryId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FisheryEEZ_pkey" PRIMARY KEY ("eezId","fisheryId")
);

-- CreateTable
CREATE TABLE "FisheryGearType" (
    "gearTypeId" BIGINT NOT NULL,
    "fisheryId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FisheryGearType_pkey" PRIMARY KEY ("gearTypeId","fisheryId")
);

-- CreateTable
CREATE TABLE "FisheryCatair" (
    "catairId" BIGINT NOT NULL,
    "fisheryId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FisheryCatair_pkey" PRIMARY KEY ("fisheryId","catairId")
);

-- CreateTable
CREATE TABLE "FisheryFAO" (
    "fisheryId" BIGINT NOT NULL,
    "faoId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FisheryFAO_pkey" PRIMARY KEY ("fisheryId","faoId")
);

-- CreateTable
CREATE TABLE "RMFOCatair" (
    "catairId" BIGINT NOT NULL,
    "rmfoId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RMFOCatair_pkey" PRIMARY KEY ("rmfoId","catairId")
);

-- CreateTable
CREATE TABLE "RFMOCountry" (
    "countryId" BIGINT NOT NULL,
    "rfmoId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFMOCountry_pkey" PRIMARY KEY ("rfmoId","countryId")
);

-- CreateTable
CREATE TABLE "EEZFAO" (
    "eezId" BIGINT NOT NULL,
    "faoId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EEZFAO_pkey" PRIMARY KEY ("eezId","faoId")
);

-- CreateTable
CREATE TABLE "FAOCatair" (
    "catairId" BIGINT NOT NULL,
    "faoId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAOCatair_pkey" PRIMARY KEY ("catairId","faoId")
);

-- CreateTable
CREATE TABLE "FAORFMO" (
    "rfmoId" BIGINT NOT NULL,
    "faoId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAORFMO_pkey" PRIMARY KEY ("rfmoId","faoId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" BIGINT NOT NULL,
    "permissionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_token_key" ON "Tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Grants_name_key" ON "Grants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_name_key" ON "Permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Catairs_mId_key" ON "Catairs"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_mId_key" ON "Contracts"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_mId_key" ON "Address"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_contactId_key" ON "Address"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactMethod_contactId_key" ON "ContactMethod"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "Countries_mId_key" ON "Countries"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Countries_name_key" ON "Countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EEZs_mId_key" ON "EEZs"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "FAOs_mId_key" ON "FAOs"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "GearType_mId_key" ON "GearType"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Imports_mId_key" ON "Imports"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_mId_key" ON "Documents"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Harvests_mId_key" ON "Harvests"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestVessel_mId_key" ON "HarvestVessel"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestProgram_mId_key" ON "HarvestProgram"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Programs_mId_key" ON "Programs"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductForm_mId_key" ON "ProductForm"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "RFMO_mId_key" ON "RFMO"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Rules_mId_key" ON "Rules"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Species_mId_key" ON "Species"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Tariffs_mId_key" ON "Tariffs"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Vessels_mId_key" ON "Vessels"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "IUUVessel_mId_key" ON "IUUVessel"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "VesselRegistration_mId_key" ON "VesselRegistration"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Details_mId_key" ON "Details"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Visible_mId_key" ON "Visible"("mId");

-- CreateIndex
CREATE UNIQUE INDEX "Permits_mId_key" ON "Permits"("mId");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grants" ADD CONSTRAINT "Grants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grants" ADD CONSTRAINT "Grants_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grants" ADD CONSTRAINT "Grants_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMethod" ADD CONSTRAINT "ContactMethod_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fisherys" ADD CONSTRAINT "Fisherys_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fisherys" ADD CONSTRAINT "Fisherys_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imports" ADD CONSTRAINT "Imports_exportFromId_fkey" FOREIGN KEY ("exportFromId") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imports" ADD CONSTRAINT "Imports_importToId_fkey" FOREIGN KEY ("importToId") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imports" ADD CONSTRAINT "Imports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imports" ADD CONSTRAINT "Imports_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_productFormId_fkey" FOREIGN KEY ("productFormId") REFERENCES "ProductForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_harvestVesselId_fkey" FOREIGN KEY ("harvestVesselId") REFERENCES "HarvestVessel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_gearTypeId_fkey" FOREIGN KEY ("gearTypeId") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "Tariffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_harvestProgramId_fkey" FOREIGN KEY ("harvestProgramId") REFERENCES "HarvestProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Imports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "Permits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestVessel" ADD CONSTRAINT "HarvestVessel_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestVessel" ADD CONSTRAINT "HarvestVessel_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestVessel" ADD CONSTRAINT "HarvestVessel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestProgram" ADD CONSTRAINT "HarvestProgram_simpHarvestAuthorizationRFMOId_fkey" FOREIGN KEY ("simpHarvestAuthorizationRFMOId") REFERENCES "RFMO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestProgram" ADD CONSTRAINT "HarvestProgram_simpHarvestAuthorizationCountryId_fkey" FOREIGN KEY ("simpHarvestAuthorizationCountryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rules" ADD CONSTRAINT "Rules_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessels" ADD CONSTRAINT "Vessels_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IUUVessel" ADD CONSTRAINT "IUUVessel_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VesselRegistration" ADD CONSTRAINT "VesselRegistration_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_vesselIUUId_fkey" FOREIGN KEY ("vesselIUUId") REFERENCES "IUUVessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visible" ADD CONSTRAINT "Visible_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZCatair" ADD CONSTRAINT "EEZCatair_catairId_fkey" FOREIGN KEY ("catairId") REFERENCES "Catairs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZCatair" ADD CONSTRAINT "EEZCatair_eezId_fkey" FOREIGN KEY ("eezId") REFERENCES "EEZs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZRMFO" ADD CONSTRAINT "EEZRMFO_rfmoId_fkey" FOREIGN KEY ("rfmoId") REFERENCES "RFMO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZRMFO" ADD CONSTRAINT "EEZRMFO_eezId_fkey" FOREIGN KEY ("eezId") REFERENCES "EEZs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZCountry" ADD CONSTRAINT "EEZCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZCountry" ADD CONSTRAINT "EEZCountry_eezId_fkey" FOREIGN KEY ("eezId") REFERENCES "EEZs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryRMFO" ADD CONSTRAINT "FisheryRMFO_rfmoId_fkey" FOREIGN KEY ("rfmoId") REFERENCES "RFMO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryRMFO" ADD CONSTRAINT "FisheryRMFO_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisherys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryEEZ" ADD CONSTRAINT "FisheryEEZ_eezId_fkey" FOREIGN KEY ("eezId") REFERENCES "EEZs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryEEZ" ADD CONSTRAINT "FisheryEEZ_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisherys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryGearType" ADD CONSTRAINT "FisheryGearType_gearTypeId_fkey" FOREIGN KEY ("gearTypeId") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryGearType" ADD CONSTRAINT "FisheryGearType_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisherys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryCatair" ADD CONSTRAINT "FisheryCatair_catairId_fkey" FOREIGN KEY ("catairId") REFERENCES "Catairs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryCatair" ADD CONSTRAINT "FisheryCatair_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisherys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryFAO" ADD CONSTRAINT "FisheryFAO_fisheryId_fkey" FOREIGN KEY ("fisheryId") REFERENCES "Fisherys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FisheryFAO" ADD CONSTRAINT "FisheryFAO_faoId_fkey" FOREIGN KEY ("faoId") REFERENCES "FAOs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RMFOCatair" ADD CONSTRAINT "RMFOCatair_catairId_fkey" FOREIGN KEY ("catairId") REFERENCES "Catairs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RMFOCatair" ADD CONSTRAINT "RMFOCatair_rmfoId_fkey" FOREIGN KEY ("rmfoId") REFERENCES "RFMO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFMOCountry" ADD CONSTRAINT "RFMOCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFMOCountry" ADD CONSTRAINT "RFMOCountry_rfmoId_fkey" FOREIGN KEY ("rfmoId") REFERENCES "RFMO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZFAO" ADD CONSTRAINT "EEZFAO_eezId_fkey" FOREIGN KEY ("eezId") REFERENCES "EEZs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EEZFAO" ADD CONSTRAINT "EEZFAO_faoId_fkey" FOREIGN KEY ("faoId") REFERENCES "FAOs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAOCatair" ADD CONSTRAINT "FAOCatair_catairId_fkey" FOREIGN KEY ("catairId") REFERENCES "Catairs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAOCatair" ADD CONSTRAINT "FAOCatair_faoId_fkey" FOREIGN KEY ("faoId") REFERENCES "FAOs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAORFMO" ADD CONSTRAINT "FAORFMO_rfmoId_fkey" FOREIGN KEY ("rfmoId") REFERENCES "RFMO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAORFMO" ADD CONSTRAINT "FAORFMO_faoId_fkey" FOREIGN KEY ("faoId") REFERENCES "FAOs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
