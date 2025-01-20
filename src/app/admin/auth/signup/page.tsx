'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]> | null>(null); // Store errors per field
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Signup successful, redirect
                router.push('/admin/gallery');
            } else {
                // Signup failed, display error message and errors
                setMessage(data.message || 'Signup failed.');
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors(null); // Clear previous errors if the new response doesn't have them
                }
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setMessage('An unexpected error occurred.');
            setErrors(null); // Clear errors in case of a network error
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create Account</h1>

                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mt-2">Username</label>
                <input
                    type="email"
                    name="username"
                    id="username"
                    placeholder="Enter your email"
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                    Submit
                </button>

                {message && <p className={`mt-4 text-sm ${message.includes('success') ? "text-teal-500" : "text-red-500"}`}>{message}</p>}

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <a href="/admin/auth/login" className="text-blue-500 hover:underline hover:text-blue-600">
                        Login here
                    </a>
                </p>
            </form>
        </div>
    );
}