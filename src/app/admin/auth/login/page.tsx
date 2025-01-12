'use client';

import { handleLogin } from "@/app/lib/actions"
import { useActionState } from 'react';
import PasswordManagerIndicator from "@/app/components/PasswordManagerIndicator";
import { useRouter } from 'next/navigation'; // Use next/navigation in app directory
import { useEffect } from 'react';

export default function Login() {
    const initialState = { message: null, success: null }; // Define initial state
    const[login, formAction] = useActionState(handleLogin, initialState);

    const router = useRouter()

    useEffect(() => {
        if (login?.success) { // Check if login is defined and success is true
          router.push('/admin/blog');
        }
      }, [login?.success, router]); // Add router to the dependency array
    

    return (        
        <div>
            <form action={formAction}>
                <label className="mt-2"></label>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    required
                />
                <label className="mt-2"></label>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    required
                />
                <button>Submit</button>
                {login.message && <p className={login.success ? "text-teal-500" : "text-red-500"}>{login.message}</p>}
                <PasswordManagerIndicator /> {/* React receives the expected component. No more hydration errors. */}
            </form>
        </div>
    )
}