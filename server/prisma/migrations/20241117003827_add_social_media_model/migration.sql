/*
  Warnings:

  - You are about to drop the column `socialMedias` on the `UserProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SocialMediaNames" AS ENUM ('Discord', 'Telegram', 'X', 'Tiktok', 'TwitchTV', 'Youtube');

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "socialMedias";

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" SERIAL NOT NULL,
    "name" "SocialMediaNames" NOT NULL,
    "tag" TEXT,
    "profileLink" TEXT,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SocialMediaToUserProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SocialMediaToUserProfile_AB_unique" ON "_SocialMediaToUserProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_SocialMediaToUserProfile_B_index" ON "_SocialMediaToUserProfile"("B");

-- AddForeignKey
ALTER TABLE "_SocialMediaToUserProfile" ADD CONSTRAINT "_SocialMediaToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "SocialMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SocialMediaToUserProfile" ADD CONSTRAINT "_SocialMediaToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
