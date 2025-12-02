import { create } from "domain";
import { Role } from "../auth/auth.service.js";
import { prisma } from "../lib/db.js";
import { extrairCamposComIA } from "../utils/extrairCampos.js";
import { decodeBase64PdfToText } from "../utils/pdfToText.js";

export const getOneUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId, active: true },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
};

export const getAllUsers = async (pagination?: {
  skip?: number;
  take?: number;
}) => {
  return prisma.user.findMany({
    where: { active: true },
    skip: pagination?.skip,
    take: pagination?.take,
  });
};

export const inactivateUser = async (userId: string) => {
  //verificar se usuario existe e está ativo
  const user = await prisma.user.findUnique({
    where: { id: userId, active: true },
  });
  if (!user) {
    return null;
  }
  return prisma.user.update({
    where: { id: userId },
    data: { active: false },
  });
};

export const updateUser = async (
  userId: string,
  updatedUser: { name?: string; role?: Role; email?: string }
) => {
  //verificar se usuario existe e está ativo
  const user = await prisma.user.findUnique({
    where: { id: userId, active: true },
  });
  if (!user) {
    return null;
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...updatedUser,
    },
  });
};

export const getEdicoes = async () => {
  try {
    const edicoes = await prisma.historicoEdicao.findMany({
      orderBy: { data_acao: "desc" },
    });
    return edicoes;
  } catch (error) {
    throw new Error("Error retrieving edicoes: " + error);
  }
};

export const createLaudo = async (laudoData: {
  userId: string;
  nome_arquivo: string;
  arquivo: string;
}) => {
  try {
    // 1) Cria o laudo básico
    const newLaudo = await prisma.laudo.create({
      data: {...laudoData, qtd_campo_extraido: 0, confiabilidade: null},
    });

    // 2) Extrai texto do PDF (se você estiver mandando PDF em base64)
    const textoLaudo = await decodeBase64PdfToText(laudoData.arquivo);

    // 3) Chama a IA para extrair campos
    const campos = await extrairCamposComIA(textoLaudo);

    // 4) Atualiza laudo + cria registro em Extracao
    await prisma.laudo.update({
      where: { id: newLaudo.id },
      data: {
        qtd_campo_extraido: Object.values(campos).filter((v) => v !== null).length,
        confiabilidade: campos.confiabilidade,
      },
    });

    for (const [nome_campo, valor_extraido] of Object.entries(campos)) {
      if (valor_extraido !== null) {
        await createExtracao({
          userId: laudoData.userId,
          laudoId: newLaudo.id,
          nome_campo,
          valor_extraido: String(valor_extraido),
        });
      }
    }

    return newLaudo;
  } catch (error) {
    throw new Error("Error creating laudo: " + error);
  }
};

export const deleteLaudo = async (laudoId: string) => {
  try {
    const deletedLaudo = await prisma.laudo.delete({
      where: { id: laudoId },
    });
    return deletedLaudo;
  } catch (error) {
    throw new Error("Error deleting laudo: " + error);
  }
};

export const createExtracao = async (extracaoData: {
  userId: string;
  laudoId: string;
  nome_campo: string;
  valor_extraido: string;
}) => {
  try {
    const newExtracao = await prisma.extracao.create({
      data: extracaoData,
    });
    return newExtracao;
  } catch (error) {
    throw new Error("Error creating extracao: " + error);
  }
};

export const createExportacao = async (exportacaoData: {
  userId: string;
  formato_arquivo: string;
}) => {
  try {
    const newExportacao = await prisma.exportacao.create({
      data: exportacaoData,
    });
    return newExportacao;
  } catch (error) {
    throw new Error("Error creating exportacao: " + error);
  }
};
