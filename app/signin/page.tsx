'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { json } from 'stream/consumers';

export default function SignInPage() {
  const [identifier, setIdentifier] = useState(''); // Username or Email
  const [password, setPassword] = useState(''); // Password field
  const [code, setCode] = useState(''); // One-time code
  const [useCode, setUseCode] = useState(false); // Whether to use one-time code
  const router = useRouter();

  // Request OTP when user opts to use it
  const handleRequestOtp = async () => {
    try {
      
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier }),
      });
      
      if (res.ok) {
        alert('OTP sent to your email.');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine the right credentials to send to signIn
    const result = await signIn('credentials', {
      identifier, // Email or username
      password: useCode ? undefined : password, // If using code, don't send password
      code: useCode ? code : undefined, // Send the code if using one-time login
      redirect: false,
    });

    if (result?.ok) {
      console.log('Login succeeded!');
      router.push('/');
    } else {
      console.log('Login failed:', result);
      alert('Invalid username/email or password or code');
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
          {!useCode ? (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-darkBackground text-lightText"
            />
          ) : (
            <input
              type="text"
              placeholder="One-time Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-darkBackground text-lightText"
            />
          )}
        </div>

        <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">
          Sign In
        </button>

        <div className="flex justify-center items-center mt-4">
          <label className="mr-2 text-lightText">Use one-time code?</label>
          <input
            type="checkbox"
            checked={useCode}
            onChange={(e) => setUseCode(e.target.checked)}
            className="cursor-pointer"
          />
        </div>

        {useCode && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleRequestOtp}
              className="w-full bg-primary text-white py-3 rounded-md"
            >
              Request OTP
            </button>
          </div>
        )}

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
