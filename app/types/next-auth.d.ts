// types/next-auth.d.ts or wherever fits your project structure
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string | null 
      friendIds: number[]
    }
  }

  interface User {
    id: string
    email: string
    username: string
  }

  declare module "next-auth/jwt" {
    interface JWT {
      id: string
      email: string
      username: string
    }
  }
}
