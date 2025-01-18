// src/app/admin/layout.tsx
'use client';

import { ReactNode } from "react";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4 ">
        <div className="flex justify-end">
          <LogoutButton className="" />
        </div>
        <h1 className="text-lg font-bold m-auto text-center -mt-4 pb-4">Admin Dashboard</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

