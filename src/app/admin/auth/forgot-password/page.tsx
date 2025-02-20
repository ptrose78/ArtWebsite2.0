'use client';

import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form onSubmit={handleResetRequest} className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Forgot Password</h1>

        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mt-1 border border-gray-300 rounded"
        />

        <button type="submit" className="w-full p-2 mt-4 bg-blue-500 text-white rounded">
          Send Reset Link
        </button>

        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
