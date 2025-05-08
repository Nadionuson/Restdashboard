'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const errorInfo = {
      message: 'User redirected to /error',
      timestamp: new Date().toISOString(),
      path: pathname,
      userAgent: navigator.userAgent,
    };

    console.error('Client Error:', errorInfo);

    // Optionally send to server log endpoint
    fetch('/api/log-client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo),
    }).catch(console.error);
  }, [pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBackground text-lightText px-4">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="mb-6 text-lg text-mutedText">We're sorry for the inconvenience. Please try again or report the issue.</p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/')}
          className="bg-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition"
        >
          Go back home
        </button>
        <button
          onClick={() => alert('Error report sent (mock)')}
          className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition"
        >
          Report this error
        </button>
      </div>
    </div>
  );
}
