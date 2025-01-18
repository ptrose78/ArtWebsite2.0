'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            const response = await fetch('/api/logout', { // Send request to logout API route
                method: 'POST', // Or DELETE, depending on your API design
            });
            if (response.ok) {
                // Clear cookies on client side after successful server logout
                document.cookie = "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                router.push("/admin/auth/login");
            } else {
                const errorData = await response.json()
                console.error("Logout failed", errorData.message);
                // Handle server error, e.g., display a message to the user
            }
        } catch (error) {
            console.error("Logout failed", error);
            // Handle network errors
        } finally {
            setIsLoggingOut(false); // Reset the button state
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`px-4 py-2 rounded transition ${
                isLoggingOut
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
            }`}
        >
            {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
    );
}