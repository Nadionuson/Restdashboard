import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./SessionWrapper";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Restaurant Hub - Modern Restaurant Dashboard",
  description: "A modern, minimalist restaurant management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-background text-foreground`}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
