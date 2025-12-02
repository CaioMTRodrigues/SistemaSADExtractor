/*
  Warnings:

  - Added the required column `extracaoId` to the `HistoricoEdicao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoricoEdicao" ADD COLUMN     "extracaoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Extracao" (
    "id" TEXT NOT NULL,
    "laudoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome_campo" TEXT NOT NULL,
    "valor_extraido" TEXT NOT NULL,
    "valor_editado" TEXT,
    "confiabilidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Extracao_pkey" PRIMARY KEY ("id","laudoId")
);

-- AddForeignKey
ALTER TABLE "HistoricoEdicao" ADD CONSTRAINT "HistoricoEdicao_extracaoId_laudoId_fkey" FOREIGN KEY ("extracaoId", "laudoId") REFERENCES "Extracao"("id", "laudoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extracao" ADD CONSTRAINT "Extracao_laudoId_fkey" FOREIGN KEY ("laudoId") REFERENCES "Laudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extracao" ADD CONSTRAINT "Extracao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
