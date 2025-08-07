/*
  Warnings:

  - You are about to drop the column `address` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `openingHours` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "address",
DROP COLUMN "openingHours",
DROP COLUMN "phoneNumber",
DROP COLUMN "website";

-- CreateTable
CREATE TABLE "public"."ContactDetails" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "latitude" TEXT,
    "Longitude" TEXT,
    "phoneNumber" TEXT,
    "website" TEXT,
    "openingHours" TEXT,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactDetails_restaurantId_key" ON "public"."ContactDetails"("restaurantId");

-- AddForeignKey
ALTER TABLE "public"."ContactDetails" ADD CONSTRAINT "ContactDetails_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
