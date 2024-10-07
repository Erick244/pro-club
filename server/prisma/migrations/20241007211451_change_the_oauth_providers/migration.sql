/*
  Warnings:

  - The values [Reddit] on the enum `OAuthProvider` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OAuthProvider_new" AS ENUM ('Google', 'Facebook', 'Github', 'Discord');
ALTER TABLE "User" ALTER COLUMN "oauthProvider" TYPE "OAuthProvider_new" USING ("oauthProvider"::text::"OAuthProvider_new");
ALTER TYPE "OAuthProvider" RENAME TO "OAuthProvider_old";
ALTER TYPE "OAuthProvider_new" RENAME TO "OAuthProvider";
DROP TYPE "OAuthProvider_old";
COMMIT;
