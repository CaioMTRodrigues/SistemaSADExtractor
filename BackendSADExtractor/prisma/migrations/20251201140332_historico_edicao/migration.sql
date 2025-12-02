-- CreateTable
CREATE TABLE "HistoricoEdicao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "laudoId" TEXT NOT NULL,
    "campo_editado" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "data_acao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoEdicao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoricoEdicao" ADD CONSTRAINT "HistoricoEdicao_laudoId_fkey" FOREIGN KEY ("laudoId") REFERENCES "Laudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoEdicao" ADD CONSTRAINT "HistoricoEdicao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
