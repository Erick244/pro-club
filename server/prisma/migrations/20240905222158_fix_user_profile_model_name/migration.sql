/*
  Warnings:

  - You are about to drop the column `userPofileId` on the `GameConfig` table. All the data in the column will be lost.
  - You are about to drop the column `userPofileId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserPofile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userProfileId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameConfig" DROP CONSTRAINT "GameConfig_userPofileId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userPofileId_fkey";

-- AlterTable
ALTER TABLE "GameConfig" DROP COLUMN "userPofileId",
ADD COLUMN     "userProfileId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userPofileId",
ADD COLUMN     "userProfileId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserPofile";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL,
    "availableTimeToPlay" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "socialMedias" JSONB NOT NULL,
    "gamingSetup" JSONB NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameConfig" ADD CONSTRAINT "GameConfig_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
