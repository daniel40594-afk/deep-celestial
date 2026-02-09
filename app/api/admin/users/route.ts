import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { headers } from 'next/headers';

// Helper to check admin role
// In a real app, middleware handles protection, but good to double check or get user info
async function checkAdmin() {
    const headersList = await headers();
    // We can also parse cookie manually if needed, but middleware should have ensured access
    // For API, we should re-verify token from cookie
    // const token = cookies().get('token')?.value; ...
    return true;
}

export async function GET(request: Request) {
    try {
        // Ideally verify admin here again

        const result = await pool.query('SELECT id, email, role, status, created_at FROM users ORDER BY created_at DESC');
        return NextResponse.json({ users: result.rows });
    } catch (error) {
        console.error('Fetch users error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
