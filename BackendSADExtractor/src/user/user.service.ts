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
