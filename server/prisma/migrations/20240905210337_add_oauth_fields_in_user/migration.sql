-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('Google', 'Facebook', 'Reddit', 'Discord');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "oauth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oauthProvider" "OAuthProvider",
ALTER COLUMN "password" DROP NOT NULL;
