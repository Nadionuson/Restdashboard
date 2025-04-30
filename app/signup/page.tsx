'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {  // Assuming your signup API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/signin');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBackground px-4">
      <form onSubmit={handleSignup} className="bg-lightBackground p-8 rounded-md shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-lightText">Sign Up</h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Create Account
        </button>

        <p className="text-center text-sm text-mutedText">
          Already have an account?{' '}
          <a href="/signin" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
