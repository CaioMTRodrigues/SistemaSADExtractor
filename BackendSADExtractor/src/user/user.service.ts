import { Role } from "../auth/auth.service.js";
import { prisma } from "../lib/db.js";

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
  qtd_campo_extraido: number;
  confiabilidade: number;
  arquivo: string | null;
}) => {
  try {
    const newLaudo = await prisma.laudo.create({
      data: laudoData,
    });
    return newLaudo;
  } catch (error) {
    throw new Error("Error creating laudo: " + error);
  }
}

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