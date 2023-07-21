/*
  Warnings:

  - You are about to drop the column `is_active_user` on the `StripeLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripeLogs" DROP COLUMN "is_active_user",
ADD COLUMN     "isActiveUser" BOOLEAN NOT NULL DEFAULT false;
