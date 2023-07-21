/*
  Warnings:

  - You are about to drop the column `mId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ContactMethod` table. All the data in the column will be lost.
  - You are about to drop the column `mId` on the `Contacts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "mId";

-- AlterTable
ALTER TABLE "ContactMethod" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Contacts" DROP COLUMN "mId";
