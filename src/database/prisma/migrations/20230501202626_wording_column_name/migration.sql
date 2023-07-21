/*
  Warnings:

  - You are about to drop the column `productFromat` on the `Harvests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Harvests" DROP COLUMN "productFromat",
ADD COLUMN     "productFormat" "ProductFormat" NOT NULL DEFAULT 'FROZEN';
