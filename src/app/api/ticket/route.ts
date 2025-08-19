import { getData, writeDB } from "@src/utils/dbOperation";
import { generateUUID, Ticket, TicketSchema } from "@src/utils";
import { NextResponse } from "next/server";
import path from "path";
import { authenticateUser } from "@src/utils/authUser";

const dbPath = path.join(process.cwd(), "src", "db.json");

export async function POST(req: Request) {
	try {
		const db = getData(dbPath);
		authenticateUser(req, db);
		const payload = await req.json();

		// validation
		const parsed = TicketSchema.safeParse(payload);
		if (!parsed.success) {
			return NextResponse.json(
				{ success: false, errors: parsed.error.issues[0].message },
				{ status: 400 },
			);
		}

		const newTicket: Ticket = {
			id: generateUUID(),
			...parsed.data,
			ticketType: "Free",
			createdAt: new Date().toISOString(),
		};

		db.tickets.push(newTicket);
		writeDB(db, dbPath);

		return NextResponse.json({ success: true, data: newTicket }, { status: 201 });
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
