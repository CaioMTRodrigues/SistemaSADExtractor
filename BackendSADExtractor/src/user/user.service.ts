import { Role } from "../auth/auth.service.js";
import { prisma } from "../lib/db.js";

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
