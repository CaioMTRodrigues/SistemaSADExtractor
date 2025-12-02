-- CreateTable
CREATE TABLE "Laudo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "qtd_campo_extraido" INTEGER NOT NULL,
    "confiabilidade" DOUBLE PRECISION NOT NULL,
    "arquivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Laudo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Laudo" ADD CONSTRAINT "Laudo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
