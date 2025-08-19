import { getData, writeDB } from "@src/utils/dbOperation";
import { generateUUID, OrderSchema, Order, Event, Ticket } from "@src/utils";
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
		const parsed = OrderSchema.safeParse(payload);
		if (!parsed.success) {
			return NextResponse.json(
				{ success: false, errors: parsed.error.issues[0].message },
				{ status: 400 },
			);
		}

		const newOrder: Order = {
			id: generateUUID(),
			...parsed.data,
			userId: user.id,
			status: "confirmed",
			createdAt: new Date().toISOString(),
		};

		db.orders.push(newOrder);
		writeDB(db, dbPath);

		return NextResponse.json(
			{ success: true, data: newOrder, message: "Event was booked successfully" },
			{ status: 201 },
		);
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

function getEvent(events: Event[], eventId: string) {
	const event = events.find((event) => event.id === eventId);

	return event || {};
}

function getTicket(tickets: Ticket[], ticketId: string) {
	const ticket = tickets.find((ticket) => ticket.id === ticketId);

	return ticket || {};
}

export async function GET(req: Request) {
	try {
		const db = getData(dbPath);
		const user = authenticateUser(req, db);

		const orders = db.orders.filter((order) => order.userId === user.id);

		const userOrderData = orders.map((order) => ({
			id: order.id,
			user,
			event: getEvent(db.events, order.eventId),
			ticket: getTicket(db.tickets, order.ticketId),
			status: order.status,
			createdAt: order.createdAt,
		}));

		return NextResponse.json({ success: true, data: userOrderData }, { status: 200 });
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
