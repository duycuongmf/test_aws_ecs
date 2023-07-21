/*
  Warnings:

  - The primary key for the `Grants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Grants` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Grants` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Grants_name_key";

-- AlterTable
ALTER TABLE "Grants" DROP CONSTRAINT "Grants_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD CONSTRAINT "Grants_pkey" PRIMARY KEY ("organizationId", "userId");

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "role";
