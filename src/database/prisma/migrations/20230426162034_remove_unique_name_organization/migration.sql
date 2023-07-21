-- DropIndex
DROP INDEX "Organization_name_key";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "name" SET DEFAULT 'default';
