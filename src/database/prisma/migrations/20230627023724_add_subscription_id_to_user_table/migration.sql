/*
  Warnings:

  - You are about to drop the column `subcriptionId` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "subcriptionId",
ADD COLUMN     "subscriptionId" VARCHAR(50);
