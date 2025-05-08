// app/layout.server.tsx (server-side layout for metadata)
import type { Metadata } from "next";
import { ReactNode } from "react";

// Metadata (optional) for server-side
export const metadata: Metadata = {
  title: "Restaurant Dashboard",
  description: "Manage and explore your favorite restaurants",
};

export default function RootLayoutServer({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
