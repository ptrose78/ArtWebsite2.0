'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordManagerIndicator from '@/app/components/PasswordManagerIndicator'

export default function Login() {
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      try {
          const response = await fetch('/api/login', {
              method: 'POST',
              body: formData,
          });
          console.log(response.ok)
          if (!response.ok) {
              // Handle non-OK responses
             try {
                  const errorData = await response.json();
                  setMessage(errorData.message || `Login failed with status ${response.status}.`);
                  if (errorData.errors) {
                      setErrors(errorData.errors);
                  }
              } catch (jsonError) {
                  console.error("Error parsing JSON error:", jsonError);
                  setMessage(`Login failed with status ${response.status}. Could not parse error details.`);
              }
          } else {
              // Handle successful login
              const data = await response.json();
              setMessage(data.message); // Set the success message
              if(data.success) {
                router.push("/admin/site/gallery"); // Redirect only after successful login
              }
          }
      } catch (error) {
          console.error('Error during login:', error);
          setMessage('An unexpected error occurred.');
      }
  };


    return (
        <div className="flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h1>

                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    required
                    className="w-full p-2 mt-1 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors?.username && errors.username.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm">{error}</p>
                ))}

                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors?.password && errors.password.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm">{error}</p>
                ))}

                <button type="submit" className="w-full p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Submit</button>

                {message && <p className={`mt-4 text-sm ${message.includes('success') ? "text-teal-500" : "text-red-500"}`}>{message}</p>}

                <PasswordManagerIndicator />

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Don't have an account?{' '}
                    <a href="/admin/auth/signup" className="text-blue-500 hover:underline hover:text-blue-600 mr-2">
                        Create account
                    </a>   
                </p>
                <p className="mt-4 text-sm text-gray-600 text-center">
                <a href="/admin/auth/forgot-password" className="text-blue-500 hover:underline hover:text-blue-600">Forgot Password?</a>
                </p>
            </form>
        </div>
    );
}