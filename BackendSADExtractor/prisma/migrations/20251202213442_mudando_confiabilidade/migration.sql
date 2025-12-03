/*
  Warnings:

  - You are about to drop the column `confiabilidade` on the `Extracao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Extracao" DROP COLUMN "confiabilidade";

-- AlterTable
ALTER TABLE "Laudo" ADD COLUMN     "confiabilidade" TEXT;
