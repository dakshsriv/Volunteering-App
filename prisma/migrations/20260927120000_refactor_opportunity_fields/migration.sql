-- DropColumn
ALTER TABLE "Opportunity" DROP COLUMN "environment";

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "organization" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Opportunity" ALTER COLUMN "organization" DROP DEFAULT;

ALTER TABLE "Opportunity" ADD COLUMN     "requirements" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Opportunity" ALTER COLUMN "requirements" DROP DEFAULT;

ALTER TABLE "Opportunity" ADD COLUMN     "commitment" TEXT NOT NULL DEFAULT 'One-Time';
ALTER TABLE "Opportunity" ALTER COLUMN "commitment" DROP DEFAULT;

ALTER TABLE "Opportunity" ADD COLUMN     "hours" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Opportunity" ALTER COLUMN "hours" DROP DEFAULT;
