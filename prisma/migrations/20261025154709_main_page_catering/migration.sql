-- DropForeignKey
ALTER TABLE "ApplyEvent" DROP CONSTRAINT "ApplyEvent_opportunityId_fkey";

-- AddForeignKey
ALTER TABLE "ApplyEvent" ADD CONSTRAINT "ApplyEvent_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
