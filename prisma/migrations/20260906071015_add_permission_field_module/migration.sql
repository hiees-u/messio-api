/*
  Warnings:

  - Added the required column `permission` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "permission" TEXT NOT NULL;
