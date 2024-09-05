/*
  Warnings:

  - You are about to drop the column `avaliabletimeToPlay` on the `UserPofile` table. All the data in the column will be lost.
  - Added the required column `availableTimeToPlay` to the `UserPofile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPofile" DROP COLUMN "avaliabletimeToPlay",
ADD COLUMN     "availableTimeToPlay" TEXT NOT NULL;
