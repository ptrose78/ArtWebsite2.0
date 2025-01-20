// src/app/admin/layout.tsx
import { ReactNode } from "react";
import AdminNavLink from "@/app/components/AdminNavLink";

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="p-4"> {/* Added nav for semantic correctness */}
                <div className="mx-auto flex justify-center"> {/* Center the links */}
                    <AdminNavLink href="/admin/site/gallery">Gallery</AdminNavLink>
                    <AdminNavLink href="/admin/site/blog">Blogs</AdminNavLink>
                </div>
            </nav>
            <main className="p-6">{children}</main>
        </div>
    );
}
