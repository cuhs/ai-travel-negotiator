-- Bring the local migration history in line with the checked-in Prisma schema
-- and add the structured trip activity brief used by the concierge flow.
ALTER TABLE "Trip" ADD COLUMN "negotiationBrief" TEXT;
ALTER TABLE "Trip" ADD COLUMN "activityBrief" TEXT;
ALTER TABLE "NegotiationCall" ADD COLUMN "securedPerks" TEXT;
ALTER TABLE "NegotiationCall" ADD COLUMN "packageSummary" TEXT;
ALTER TABLE "NegotiationCall" ADD COLUMN "totalPerkValue" REAL;
