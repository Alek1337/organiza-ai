/*
  Warnings:

  - You are about to drop the column `locationId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_locationId_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_userId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "locationId",
ADD COLUMN     "location" TEXT;

-- DropTable
DROP TABLE "locations";
