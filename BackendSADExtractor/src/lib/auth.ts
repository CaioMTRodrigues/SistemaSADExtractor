import { betterAuth } from "better-auth";
import { prisma } from "./db.js";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
});