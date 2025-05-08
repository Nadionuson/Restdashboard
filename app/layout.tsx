// app/layout.tsx (client-side layout for handling global errors, fonts, and session)
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import SessionWrapper from "./SessionWrapper";
import "./globals.css";

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
      router.push('/error');
    };
  
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      router.push('/error');
    };
  
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
  
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [router]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
