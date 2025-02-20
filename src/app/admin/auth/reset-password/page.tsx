'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (data.success) {
      setTimeout(() => router.push('/admin/auth/login'), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form onSubmit={handlePasswordReset} className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Password</h1>

        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mt-1 border border-gray-300 rounded"
        />

        <button type="submit" className="w-full p-2 mt-4 bg-blue-500 text-white rounded">
          Update Password
        </button>

        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
