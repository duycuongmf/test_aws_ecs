-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "email" VARCHAR(200),
ADD COLUMN     "phone" VARCHAR(50),
ALTER COLUMN "name" DROP NOT NULL;
