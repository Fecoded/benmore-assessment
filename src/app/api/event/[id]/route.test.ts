import { GET, PUT, DELETE } from "./route";
import { NextRequest } from "next/server";

jest.mock("@src/utils/dbOperation");
jest.mock("@src/utils/authUser");

// Mock NextResponse.json
jest.mock("next/server", () => {
	const actual = jest.requireActual("next/server");
	return {
		...actual,
		NextResponse: {
			json: (data: Record<string, unknown>, init?: ResponseInit) => ({
				...data,
				status: init?.status || 200,
				cookies: {},
				async json() {
					return data;
				},
			}),
		},
	};
});

import { getData, writeDB } from "@src/utils/dbOperation";
import { authenticateUser } from "@src/utils/authUser";

describe("/api/event/[id]", () => {
	const mockUser = { id: "user-1", name: "Test User" };
	const mockEvent = {
		id: "event-1",
		title: "Test Event",
		description: "A test event",
		date: new Date().toISOString(),
		venue: "Test Venue",
		createdBy: "user-1",
		createdAt: new Date().toISOString(),
	};
	const mockTicket = { eventId: "event-1", ticketId: "ticket-1" };

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 404 if event not found (GET)", async () => {
		(getData as jest.Mock).mockReturnValue({ events: [], tickets: [] });
		(authenticateUser as jest.Mock).mockReturnValue(mockUser);
		const cxt = { params: Promise.resolve({ id: "event-1" }) };
		const req = {} as NextRequest;
		const res = await GET(req, cxt);
		expect(res.status).toBe(404);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data).toBeNull();
	});

	it("returns event and tickets (GET)", async () => {
		(getData as jest.Mock).mockReturnValue({ events: [mockEvent], tickets: [mockTicket] });
		(authenticateUser as jest.Mock).mockReturnValue(mockUser);
		const cxt = { params: Promise.resolve({ id: "event-1" }) };
		const req = {} as NextRequest;
		const res = await GET(req, cxt);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data.id).toBe("event-1");
		expect(Array.isArray(json.data.tickets)).toBe(true);
	});

	it("updates event (PUT)", async () => {
		const db = { events: [mockEvent], tickets: [] };
		(getData as jest.Mock).mockReturnValue(db);
		(writeDB as jest.Mock).mockImplementation(() => {});
		(authenticateUser as jest.Mock).mockReturnValue(mockUser);
		const cxt = { params: Promise.resolve({ id: "event-1" }) };
		const req = { json: async () => ({ title: "Updated Event" }) } as NextRequest;
		const res = await PUT(req, cxt);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data.title).toBe("Updated Event");
	});

	it("deletes event (DELETE)", async () => {
		const db = { events: [mockEvent], tickets: [] };
		(getData as jest.Mock).mockReturnValue(db);
		(writeDB as jest.Mock).mockImplementation(() => {});
		(authenticateUser as jest.Mock).mockReturnValue(mockUser);
		const cxt = { params: Promise.resolve({ id: "event-1" }) };
		const req = {} as NextRequest;
		const res = await DELETE(req, cxt);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.message).toBe("Event deleted");
	});
});
