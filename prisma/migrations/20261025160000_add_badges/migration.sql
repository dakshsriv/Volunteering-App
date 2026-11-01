-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "badges" TEXT[] DEFAULT ARRAY[]::TEXT[];