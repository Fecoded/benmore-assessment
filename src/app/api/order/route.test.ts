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
				async json() {
					return data;
				},
			}),
		},
	};
});

import { getData } from "@src/utils/dbOperation";
import { authenticateUser } from "@src/utils/authUser";

describe("POST api/order", () => {
	const mockUser = {
		name: "test",
		email: "test@example.com",
		password: "hashedpassword",
		role: "User",
	};

	const mockOrder = {
		eventId: "123e4567-e89b-12d3-a456-426614174000",
		ticketId: "123e4567-e89b-12d3-a456-426614174000",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("return 400 if validation fails", async () => {
		const req = { json: async () => ({}) } as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.success).toBe(false);
		expect(json.errors).toBeDefined();
	});

	it("return 201 if event was booked successfully", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser], orders: [] });
		(authenticateUser as jest.Mock).mockResolvedValue(false);

		const req = {
			json: async () => ({
				eventId: mockOrder.eventId,
				ticketId: mockOrder.ticketId,
			}),
		} as NextRequest;

		const res = await POST(req);
		expect(res.status).toBe(201);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.message).toBe("Event was booked successfully");
		expect(json.data).toBeDefined();
	});

	it("return 200 if orders are returned", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser], orders: [] });
		(authenticateUser as jest.Mock).mockResolvedValue(false);

		const req = { json: async () => ({}) } as NextRequest;
		const res = await GET(req);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data).toBeDefined();
	});
});
