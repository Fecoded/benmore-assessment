import { authenticateUser } from "@src/utils/authUser";
import { getData, writeDB } from "@src/utils/dbOperation";
import { NextResponse } from "next/server";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "db.json");

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function GET(req: Request, cxt: RouteContext) {
	try {
		const db = getData(dbPath);
		const user = authenticateUser(req, db);
		const { params } = cxt;
		const { id } = await params;

		const event = db.events.find((event) => event.id === id);

		if (!event) {
			return NextResponse.json(
				{ success: true, message: "Event not found", data: null },
				{ status: 404 },
			);
		}

		const tickets = db.tickets.filter((ticket) => ticket.eventId === event.id);

		const eventTicketData = {
			id: event.id,
			title: event.title,
			description: event.description,
			date: event.date,
			venue: event.venue,
			createdBy: user,
			createdAt: event.createdAt,
			tickets,
		};

		return NextResponse.json({ success: true, data: eventTicketData }, { status: 200 });
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

export async function PUT(req: Request, cxt: RouteContext) {
	try {
		const db = getData(dbPath);
		authenticateUser(req, db);
		const { params } = cxt;
		const { id } = await params;
		const payload = await req.json();
		const idx = db.events.findIndex((event) => event.id === id);

		if (idx === -1) {
			return NextResponse.json(
				{ success: false, message: "Event not found" },
				{ status: 404 },
			);
		}

		db.events[idx] = { ...db.events[idx], ...payload };
		writeDB(db, dbPath);
		return NextResponse.json({ success: true, data: db.events[idx] }, { status: 200 });
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

export async function DELETE(req: Request, cxt: RouteContext) {
	try {
		const db = getData(dbPath);
		authenticateUser(req, db);
		const { params } = cxt;
		const { id } = await params;

		const event = db.events.find((event) => event.id === id);

		if (!event) {
			return NextResponse.json(
				{ success: false, message: "Event not found" },
				{ status: 404 },
			);
		}

		const filteredEvents = db.events.filter((event) => event.id !== id);
		db.events = filteredEvents;
		writeDB(db, dbPath);
		return NextResponse.json({ success: true, message: "Event deleted" }, { status: 200 });
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
