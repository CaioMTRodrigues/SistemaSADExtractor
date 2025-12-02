-- CreateTable
CREATE TABLE "Exportacao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "formato_arquivo" TEXT NOT NULL,
    "data_exportacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exportacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exportacao" ADD CONSTRAINT "Exportacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
