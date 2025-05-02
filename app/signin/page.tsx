'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignInPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      identifier,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/');
    } else {
      alert('Invalid username/email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBackground px-4">
      <form
        onSubmit={handleLogin}
        className="bg-lightBackground p-8 rounded-md shadow-md w-full max-w-md space-y-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Dineboard Logo"
            width={80}
            height={80}
            className="mb-4"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-lightText">Sign In</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-darkBackground text-lightText"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-darkBackground text-lightText"
          />
        </div>

        <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">
          Sign In
        </button>

        <p className="text-center text-sm text-mutedText">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
