import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define protected routes
    const isAdminRoute = path.startsWith('/admin');
    const isUserRoute = path.startsWith('/user');

    if (!isAdminRoute && !isUserRoute) {
        return NextResponse.next();
    }

    const tokenFn = request.cookies.get('token')?.value;

    if (!tokenFn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(tokenFn);

    if (!payload) {
        // Invalid token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const { role, status } = payload as { role: string; status: string };

    // Admin route protection
    if (isAdminRoute) {
        if (role !== 'admin') {
            // Redirect non-admins to user dashboard or home
            return NextResponse.redirect(new URL('/user', request.url));
        }
    }

    // User route protection (also accessible by admin usually, but let's see requirements)
    // "Approved users can access the user dashboard."
    if (isUserRoute) {
        if (status !== 'approved' && role !== 'admin') {
            // Pending or rejected users cannot access dashboard
            // Maybe redirect to a status page? For now, redirect to /pending
            // But we need to make sure /pending is not protected by this same block if it was under /user
            // Let's assume /pending is a public or separate route.
            // Or we can just redirect to a specific page explaining.
            return NextResponse.redirect(new URL('/pending-approval', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*'],
};
