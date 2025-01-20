'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <Link href={href} className="relative inline-block mr-5">
            <span className={`transition-all duration-200 px-2 py-1 rounded-md ${isActive ? 'bg-blue-200 text-blue-900 font-bold no-underline' : 'text-xl text-blue-500 hover:text-blue-700 decoration-none'}`}>
                {children}
            </span>
            {isActive && (
                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-blue-700"></span>
            )}
        </Link>
    );
}