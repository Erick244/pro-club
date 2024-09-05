-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('user', 'admin', 'owner');

-- CreateEnum
CREATE TYPE "GamePlatform" AS ENUM ('PC', 'Console', 'Portable', 'Mobile', 'Browser');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "biography" TEXT,
    "roles" "UserRoles"[] DEFAULT ARRAY['user']::"UserRoles"[],
    "userPofileId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPofile" (
    "id" SERIAL NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL,
    "avaliabletimeToPlay" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "socialMedias" JSONB NOT NULL,
    "gamingSetup" JSONB NOT NULL,

    CONSTRAINT "UserPofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameConfig" (
    "id" SERIAL NOT NULL,
    "config" JSONB NOT NULL,
    "gameId" INTEGER NOT NULL,
    "userPofileId" INTEGER,

    CONSTRAINT "GameConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "distributor" TEXT NOT NULL,
    "capeImageUrl" TEXT NOT NULL,
    "platforms" "GamePlatform"[],

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserLikes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_distributor_key" ON "Game"("distributor");

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikes_AB_unique" ON "_UserLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikes_B_index" ON "_UserLikes"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userPofileId_fkey" FOREIGN KEY ("userPofileId") REFERENCES "UserPofile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameConfig" ADD CONSTRAINT "GameConfig_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameConfig" ADD CONSTRAINT "GameConfig_userPofileId_fkey" FOREIGN KEY ("userPofileId") REFERENCES "UserPofile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikes" ADD CONSTRAINT "_UserLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikes" ADD CONSTRAINT "_UserLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
