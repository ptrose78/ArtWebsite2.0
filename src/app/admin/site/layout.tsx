// src/app/admin/layout.tsx
'use client';
import Link from 'next/link';

import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <p className="mt-4 text-sm text-gray-600 text-center">
        <Link href="/admin/blog" className="text-blue-500 hover:underline hover:text-blue-600">blog</Link>
      </p>
    </div>
  );
}
