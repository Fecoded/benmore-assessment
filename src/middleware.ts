import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const Routes = (checkId?: string) => {
	const RouteList = {
		DASHBOARD: "/",
		EVENT_DETAILS: `/event/${checkId}`,
		TICKETS: "/tickets",
	};

	return RouteList;
};

export default async function middleware(req: NextRequest) {
	const authToken = req.cookies.get("USER_TOKEN")?.value;
	const { pathname } = req.nextUrl;

	const ALL_ROUTES = Object.values(Routes(pathname.split("/")[2]));

	// Decode token
	let decodedToken: JwtPayload | null = null;
	if (authToken && authToken !== "undefined") {
		try {
			decodedToken = jwtDecode<JwtPayload>(authToken);
		} catch {
			decodedToken = null; // invalid token format
		}
	}

	// Avoid using React hooks; use direct logic for handling the pathname
	const isProtectedRoute = ALL_ROUTES.includes(pathname);

	// Check expiration: exp is in seconds, Date.now() is in ms
	const isExpired = decodedToken?.exp ? Date.now() >= decodedToken.exp * 1000 : true;

	if (isProtectedRoute && (!decodedToken || isExpired)) {
		const redirectPath = "/login"; // Example redirect, change as needed
		return NextResponse.redirect(new URL(redirectPath, req.url));
	}
	return NextResponse.next();
}
