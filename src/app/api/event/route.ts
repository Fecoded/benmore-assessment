import { getData, writeDB } from "@src/utils/dbOperation";
import { Event, EventSchema, generateUUID } from "@src/utils";
import { NextResponse } from "next/server";
import path from "path";
import { authenticateUser } from "@src/utils/authUser";

const dbPath = path.join(process.cwd(), "src", "db.json");

export async function POST(req: Request) {
	try {
		const db = getData(dbPath);
		const user = authenticateUser(req, db);
		const payload = await req.json();

		// validation
		const parsed = EventSchema.safeParse(payload);
		if (!parsed.success) {
			return NextResponse.json(
				{ success: false, errors: parsed.error.issues[0].message },
				{ status: 400 },
			);
		}

		const newEvent: Event = {
			id: generateUUID(),
			...parsed.data,
			createdBy: user?.id,
			createdAt: new Date().toISOString(),
		};

		db.events.push(newEvent);
		writeDB(db, dbPath);

		return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
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

export async function GET(req: Request) {
	try {
		const db = getData(dbPath);
		const user = authenticateUser(req, db);

		// const events = db.events
		// 	.filter((event) => event.createdBy === user.id)
		// 	.map((e) => ({
		// 		id: e.id,
		// 		title: e.title,
		// 		description: e.description,
		// 		date: e.date,
		// 		venue: e.venue,
		// 		createdBy: user,
		// 		createdAt: e.createdAt,
		// 	}));

		const events = db.events.map((e) => ({
			id: e.id,
			title: e.title,
			description: e.description,
			date: e.date,
			venue: e.venue,
			createdBy: user,
			createdAt: e.createdAt,
		}));

		return NextResponse.json({ success: true, data: events }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{
				success: false,
				message: `${err}`,
			},
			{ status: 500 },
		);
	}
}
