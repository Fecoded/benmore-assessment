import { getData, writeDB } from "@src/utils/dbOperation";
import { generateUUID, User, UserSchema } from "@src/utils";
import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "db.json");

export async function POST(req: Request) {
	try {
		const db = getData(dbPath);
		const payload = await req.json();

		// validation
		const parsed = UserSchema.safeParse(payload);
		if (!parsed.success) {
			return NextResponse.json(
				{ success: false, errors: parsed.error.issues[0].message },
				{ status: 400 },
			);
		}

		const newUser: User = {
			id: generateUUID(),
			...parsed.data,
			password: await bcrypt.hash(parsed.data.password, 10),
			role: "user",
			createdAt: new Date().toISOString(),
		};

		db.users.push(newUser);
		writeDB(db, dbPath);

		return NextResponse.json({ success: true, data: newUser }, { status: 201 });
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
