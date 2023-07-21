/*
  Warnings:

  - You are about to drop the `Contracts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactMethod" DROP CONSTRAINT "ContactMethod_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Harvests" DROP CONSTRAINT "Harvests_contactId_fkey";

-- DropTable
DROP TABLE "Contracts";

-- CreateTable
CREATE TABLE "Contacts" (
    "id" BIGINT NOT NULL,
    "mId" TEXT,
    "name" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMethod" ADD CONSTRAINT "ContactMethod_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
