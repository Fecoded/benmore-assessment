import { getData } from "@src/utils/dbOperation";
import { NextResponse } from "next/server";
import path from "path";
import { authenticateUser } from "@src/utils/authUser";

const dbPath = path.join(process.cwd(), "src", "db.json");

export async function GET(req: Request) {
	try {
		const db = getData(dbPath);
		const user = authenticateUser(req, db);
		return NextResponse.json({ success: true, data: { user } }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{
				success: false,
				message: `Unauthorised, ${err}`,
			},
			{ status: 401 },
		);
	}
}
