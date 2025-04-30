// types/next-auth.d.ts or wherever fits your project structure
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    email: string
    // Add other fields if needed (e.g., passwordHash, createdAt, etc.)
  }
}
