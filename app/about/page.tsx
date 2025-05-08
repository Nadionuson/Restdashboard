// app/about/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About this app and its current deployed version.',
};

export default function AboutPage() {
  const appVersion = process.env.APP_VERSION || 'development';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBackground text-lightText px-4">
      <h1 className="text-4xl font-bold mb-4">About This App</h1>
      <p className="text-lg text-mutedText mb-6 max-w-xl text-center">
        This is a custom authentication and restaurant review app built with Next.js, Prisma, and custom OTP login.
      </p>
      <div className="text-sm text-gray-400">
        Current deployed version: <code className="font-mono text-primary">{appVersion}</code>
      </div>
    </div>
  );
}
