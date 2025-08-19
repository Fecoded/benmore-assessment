import { LoginSchema } from "@src/utils";
import { getData } from "@src/utils/dbOperation";
import { NextResponse, NextRequest } from "next/server";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "db.json");

export async function POST(req: NextRequest) {
	try {
		const db = getData(dbPath);
		const payload = await req.json();

		// validation
		const parsed = LoginSchema.safeParse(payload);
		if (!parsed.success) {
			return NextResponse.json(
				{ success: false, errors: parsed.error.issues[0].message },
				{ status: 400 },
			);
		}

		const checkUser = db.users.find((user) => user.email === parsed.data.email);

		if (!checkUser) {
			return NextResponse.json(
				{ success: false, isNewUser: true, message: "User does not exist" },
				{ status: 404 },
			);
		}

		const pinIsValid = await bcrypt.compare(parsed.data.password, checkUser?.password);

		if (!pinIsValid) {
			return NextResponse.json(
				{ success: false, message: "Invalid Credentials" },
				{ status: 400 },
			);
		}

		const tokenPayload = {
			userId: checkUser.id,
		};

		// One hour access token
		const accessToken = jwt.sign({ ...tokenPayload }, "secret", { expiresIn: 60 * 60 });

		const response = NextResponse.json(
			{ success: true, message: "login successful" },
			{ status: 200 },
		);

		response.cookies.set("USER_TOKEN", accessToken);

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
