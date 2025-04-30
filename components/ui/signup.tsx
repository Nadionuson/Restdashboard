import React, { useState } from 'react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the API to register the user
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Redirect to login page or auto-login
      console.log('User registered successfully');
    } else {
      const data = await response.json();
      setErrorMessage(data.error || 'An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl">Sign Up</h2>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          type="email"
          id="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block">Password</label>
        <input
          type="password"
          id="password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn">Sign Up</button>
    </form>
  );
};

export default SignUp;
