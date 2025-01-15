'use client'
import { useState } from 'react';
import { handleSignup } from "@/app/lib/actions";

export default function Signup() {
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(event.target as HTMLFormElement);
        const result = await handleSignup(formData);
        
        if (result.status === 200) {
            setMessage("User created successfully!");
        } else {
            setMessage(result.message || "An error occurred.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label className="mt-2">Username</label>
                <input type="text" name="username" required />

                <label className="mt-2">Password</label>
                <input type="password" name="password" required />

                <button type="submit">Sign Up</button>
            </form>
            {message && <div>{message}</div>}
        </div>
    );
}