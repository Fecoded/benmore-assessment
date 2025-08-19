import { getData } from "@src/utils/dbOperation";
import { BookedTicketSchema } from "@src/utils";
import { NextResponse } from "next/server";
import path from "path";
import { authenticateUser } from "@src/utils/authUser";
import { isEmpty } from "lodash";

const dbPath = path.join(process.cwd(), "src", "db.json");

export async function POST(req: Request) {
	try {
		const db = getData(dbPath);
		const user = authenticateUser(req, db);
		const payload = await req.json();

		// validation
		const parsed = BookedTicketSchema.safeParse(payload);
		if (!parsed.success) {
			return NextResponse.json(
				{ success: false, errors: parsed.error.issues[0].message },
				{ status: 400 },
			);
		}

		const ticket = db.orders
			.filter((order) => order.userId === user.id)
			.find((order) => order.eventId === parsed.data.eventId);

		return NextResponse.json(
			{ success: true, data: { isBooked: !isEmpty(ticket) } },
			{ status: 200 },
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
