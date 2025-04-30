import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import bcrypt from "bcryptjs"


const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required")
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        })

        if (!user) {
          throw new Error("No user found with that email")
        }

        if (!user.passwordHash) {
          throw new Error("User has no password set")
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )
      
        if (!isValidPassword) {
          throw new Error("Incorrect password")
        }
        
        
        if (user) {
          return {
            id: user.id.toString(),
            email: user.email,
            passwordHash: user.passwordHash,
            loginCode: user.loginCode,
            loginCodeExpires: user.loginCodeExpires,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt', // ✅ use JWT for credentials
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.email = user.email; 
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...(session.user || {}),
          id: token.id as string,
          email: token.email as string,
        };
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}
