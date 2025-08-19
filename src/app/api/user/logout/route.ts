import { NextResponse } from "next/server";

export async function POST() {
	try {
		const response = NextResponse.json(
			{ success: true, message: "logout successful" },
			{ status: 200 },
		);

		response.cookies.delete("USER_TOKEN");

		return response;
	} catch (err) {
		return NextResponse.json(
			{
				success: false,
				message: `Internal server error, ${err}`,
			},
			{ status: 500 },
		);
	}
}
