import { auth } from "./auth.js";
import { prisma } from "./db.js";

async function main() {
  const email = "admin@sistema.com";
  const password = "admin123";

  // Verifica se já existe um usuário admin
  const existingAdmin = await prisma.user.findFirst({ where: { email } });
  if (existingAdmin) {
    console.log("Usuário admin já existe.");
    return;
  }

  const admin = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: "Administrador",
    },
  });

  await prisma.user.update({
    where: { email: email },
    data: { role: "ADMIN", active: true, emailVerified: true },
  });
  console.log("Usuário admin criado:", admin);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
