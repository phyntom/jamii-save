import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}
	// if (pathname.startsWith('/invite/')) {
	// 	const token = pathname.split('/invite/')[1];
	// 	const response = NextResponse.next();
	// 	response.cookies.set('invitation_token', token, {
	// 		httpOnly: true,
	// 		secure: process.env.NODE_ENV === 'production',
	// 		maxAge: 60 * 60 * 24 * 7, // 7 days
	// 	});
	// 	return response;
	// }
	return NextResponse.next();
}

export const config = {
	runtime: 'nodejs',
	matcher: ['/dashboard'], // Apply middleware to specific routes
};
