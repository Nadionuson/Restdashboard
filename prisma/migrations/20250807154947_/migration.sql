/*
  Warnings:

  - You are about to drop the column `Longitude` on the `ContactDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ContactDetails" DROP COLUMN "Longitude",
ADD COLUMN     "longitude" TEXT;
