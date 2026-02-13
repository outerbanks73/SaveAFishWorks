import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  );
}

// Dev-only credentials provider — sign in with any email, no OAuth setup needed.
if (process.env.NODE_ENV === "development") {
  providers.push(
    Credentials({
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dev@example.com" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        if (!email) return null;

        // Find or create the user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
              role: "ADMIN",
            },
          });
        }

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  );
}

// In development, generate a stable secret if AUTH_SECRET is not set.
// In production AUTH_SECRET must be provided.
const secret =
  process.env.AUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "dev-secret-do-not-use-in-production"
    : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    // Credentials provider requires JWT strategy (no DB session created on authorize)
    strategy: process.env.NODE_ENV === "development" ? "jwt" : "database",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "HOBBYIST";
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        // JWT strategy (dev): read from token
        // Database strategy (prod): read from user
        if (token) {
          session.user.id = token.id as string;
          session.user.role = (token.role as string) ?? "HOBBYIST";
        } else if (user) {
          session.user.id = user.id;
          session.user.role = (user as { role?: string }).role ?? "HOBBYIST";
        }
      }
      return session;
    },
  },
});
