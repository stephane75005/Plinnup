import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

// ⚠️ Import du client Prisma généré par Prisma 7
import { PrismaClient } from "@/app/generated/prisma";

// ---------- Prisma singleton ----------
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ---------- NextAuth configuration ----------
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,

  providers: [
    // -------- Google OAuth --------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // -------- GitHub OAuth --------
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // -------- Email / Password (Credentials) --------
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ⚠️ Retour obligatoire : id doit être une string
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login", // Redirection sur la page login en cas d'erreur
  },

  callbacks: {
    async redirect({ baseUrl }) {
      // 🔹 Redirection automatique après login vers /choix
      return `${baseUrl}/choix`;
    },
  },
};

// ---------- Export handler Next.js App Router ----------
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
