/*
  Warnings:

  - Added the required column `name` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "name" VARCHAR(200) NOT NULL;
