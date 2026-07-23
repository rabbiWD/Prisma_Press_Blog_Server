/*
  Warnings:

  - You are about to drop the column `thumbnil` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "thumbnil",
ADD COLUMN     "thumbnail" TEXT;
