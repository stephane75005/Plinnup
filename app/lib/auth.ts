// app/lib/auth.ts
import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/app/generated/prisma";

// ---------- Prisma singleton ----------
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["warn", "error", "query"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ---------- Type pour NextAuth user avec rôle ----------
export type UserWithRole = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
};

// ---------- NextAuth configuration ----------
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // Email / Password
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

        // ✅ Retour avec role pour TypeScript
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name ?? null,
          role: user.role,
        } as UserWithRole;
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // Ajouter le rôle dans le JWT
    async jwt({ token, user }) {
      if (user) {
        const u = user as UserWithRole;
        token.role = u.role;
      }
      return token;
    },

    // Ajouter le rôle dans la session
    async session({ session, token }) {
      if (session.user) {
        (session.user as UserWithRole).role = token.role as string;
      }
      return session;
    },

    // Redirection sécurisée post-login
    async redirect({ url, baseUrl }) {
      // redirection relative ou absolue sécurisée
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/choix`;
    },
  },

  debug: true,
};

// ---------- Export handler pour Next.js App Router ----------
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
