/*
  Warnings:

  - Added the required column `environment` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "environment" TEXT NOT NULL;
