/*
  Warnings:

  - You are about to drop the column `confirmed` on the `invites` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_locationId_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "end" DROP NOT NULL,
ALTER COLUMN "locationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "invites" DROP COLUMN "confirmed",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profileUrl" TEXT;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
