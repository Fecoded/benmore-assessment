import { POST } from "./route";
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

import { getData } from "@src/utils/dbOperation";
import { authenticateUser } from "@src/utils/authUser";

describe("POST api/ticket/book", () => {
	const mockUser = {
		name: "test",
		email: "test@example.com",
		password: "hashedpassword",
		role: "User",
	};

	const mockTicket = {
		eventId: "123e4567-e89b-12d3-a456-426614174000",
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

	it("return 200 when event is booked", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser], orders: [] });
		(authenticateUser as jest.Mock).mockResolvedValue(false);

		const req = {
			json: async () => ({
				eventId: mockTicket.eventId,
			}),
		} as NextRequest;

		const res = await POST(req);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data).toBeDefined();
	});
});
