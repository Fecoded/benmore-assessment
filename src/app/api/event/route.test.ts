import { POST, GET } from "./route";
import { NextRequest } from "next/server";

jest.mock("@src/utils/dbOperation");
jest.mock("@src/utils/authUser");
jest.mock("@src/utils", () => ({
	...jest.requireActual("@src/utils"),
	generateUUID: () => "mock-uuid",
}));

// Mock NextResponse.json
jest.mock("next/server", () => {
	const actual = jest.requireActual("next/server");
	return {
		...actual,
		NextResponse: {
			json: (data: Record<string, unknown>, init?: ResponseInit) => ({
				...data,
				status: init?.status || 200,
				cookies: {
					set: jest.fn(),
				},
				async json() {
					return data;
				},
			}),
		},
	};
});

import { getData, writeDB } from "@src/utils/dbOperation";
import { authenticateUser } from "@src/utils/authUser";

describe("/api/event", () => {
	const mockUser = { id: "user-1", name: "Test User" };
	const mockEvent = {
		id: "mock-uuid",
		title: "Test Event",
		description: "A test event",
		date: new Date().toISOString(),
		venue: "Test Venue",
		createdBy: "user-1",
		createdAt: new Date().toISOString(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 400 if validation fails (POST)", async () => {
		(getData as jest.Mock).mockReturnValue({ events: [] });
		(authenticateUser as jest.Mock).mockReturnValue(mockUser);
		const req = { json: async () => ({}) } as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.success).toBe(false);
		expect(json.errors).toBeDefined();
	});

	it("creates a new event (POST)", async () => {
		const db = { events: [] };
		(getData as jest.Mock).mockReturnValue(db);
		(writeDB as jest.Mock).mockImplementation(() => {});
		(authenticateUser as jest.Mock).mockReturnValue(mockUser);
		const req = {
			json: async () => ({
				title: mockEvent.title,
				description: mockEvent.description,
				date: mockEvent.date,
				venue: mockEvent.venue,
			}),
		} as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(201);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data).toBeDefined();
		expect(json.data.title).toBe(mockEvent.title);
	});

	it("returns all events (GET)", async () => {
		(getData as jest.Mock).mockReturnValue({ events: [mockEvent] });
		(authenticateUser as jest.Mock).mockReturnValue(mockUser);
		const req = {} as NextRequest;
		const res = await GET(req);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(Array.isArray(json.data)).toBe(true);
		expect(json.data[0].title).toBe(mockEvent.title);
	});
});
