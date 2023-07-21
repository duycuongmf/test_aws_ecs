/*
  Warnings:

  - Added the required column `creatorId` to the `Grants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grants" ADD COLUMN     "creatorId" BIGINT NOT NULL,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Grants" ADD CONSTRAINT "Grants_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
