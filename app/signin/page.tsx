'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      identifier, // new field
      password,
      redirect: false,
    });

    console.log(result)

    if (result?.ok) {
      console.log('Login succeeded!');
      router.push('/');
    } else {
      console.log('Login failed:', result);
      alert('Invalid username/email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBackground px-4">
      <form
        onSubmit={handleLogin}
        className="bg-lightBackground p-8 rounded-md shadow-md w-full max-w-md space-y-6"
      >
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
