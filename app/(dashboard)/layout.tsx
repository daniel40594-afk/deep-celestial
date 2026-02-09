'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        // In a real app we'd call an API to clear cookie
        // For now we can just clear cookie client side if not httpOnly, 
        // but since it is httpOnly, we need an API route /api/auth/logout
        // Let's implement logout via simple redirect to login which might overwrite cookie or separate API
        // Quick fix: Set cookie to expire
        document.cookie = 'token=; Max-Age=0; path=/;';
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <nav className="border-b bg-white px-4 py-3 sm:px-6">
                <div className="flex items-center justify-between mx-auto max-w-7xl">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                            <LayoutDashboard className="h-6 w-6" />
                            <span>RBAC Dash</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mr-4">
                            <User className="h-4 w-4" />
                            <span>Account</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                {children}
            </main>
        </div>
    );
}
