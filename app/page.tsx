import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Lock, UserCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-800">
          <ShieldCheck className="h-8 w-8 text-indigo-600" />
          <span>RBAC System</span>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Secure Dashboard with <span className="text-indigo-600">Row-Level Security</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          A production-ready implementation of Authentication, Role-Based Access Control, and User Approval Workflows using Next.js, Neon DB, and Tailwind CSS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/signup">
            <Button size="lg" className="px-8 text-lg h-14">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8 text-lg h-14">Sign In</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="text-indigo-600 h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Secure Auth</h3>
            <p className="text-gray-500">JWT-based authentication with secure password hashing and HTTP-only cookies.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-indigo-600 h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">RBAC</h3>
            <p className="text-gray-500">Separated User and Admin dashboards with strict role-based protection.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserCheck className="text-indigo-600 h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Approval Flow</h3>
            <p className="text-gray-500">New users are pending by default and must be approved by an admin.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm">
        Built with Next.js 15, Tailwind & Neon
      </footer>
    </div>
  );
}
