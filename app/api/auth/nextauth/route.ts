import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client"; // chemin relatif vers le dossier généré

// Instanciation de Prisma
const prisma = new PrismaClient();

// Typage explicite AuthOptions pour TypeScript
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // 🔹 Pour prod : remplacer par vérification DB + bcrypt
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // if (!user || !user.password) return null;
        // const isValid = await bcrypt.compare(credentials.password, user.password);
        // return isValid ? user : null;

        // ⚡ Test rapide (login admin)
        if (
          credentials.email === "admin@test.com" &&
          credentials.password === "1234"
        ) {
          return { id: "1", email: credentials.email };
        }
        return null;
      },
    }),
  ],
  // ✅ Typage correct pour TypeScript
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

// Export handler pour Next.js App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
