-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userProfileId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userProfileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
