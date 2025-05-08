'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error('Critical rendering error:', error);

    // Optional: Log to a remote server
    fetch('/api/log-client-error', {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Redirect to friendly error page after logging
    const timeout = setTimeout(() => {
      router.replace('/error');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBackground text-lightText">
      <h2 className="text-xl">An unexpected error occurred. Redirecting...</h2>
    </div>
  );
}
