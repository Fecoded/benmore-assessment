import { POST } from "./route";
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

import { getData } from "@src/utils/dbOperation";
import { authenticateUser } from "@src/utils/authUser";

describe("POST api/ticket", () => {
	const mockUser = {
		name: "test",
		email: "test@example.com",
		password: "hashedpassword",
		role: "User",
	};
	const mockTicket = {
		eventId: "123e4567-e89b-12d3-a456-426614174000",
		price: "0",
		quantityAvailable: "10",
		createdAt: new Date().toISOString(),
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

	it("return 201 when ticket is created successful", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser], tickets: [] });
		(authenticateUser as jest.Mock).mockResolvedValue(false);

		const req = {
			json: async () => ({
				eventId: mockTicket.eventId,
				price: mockTicket.price,
				quantityAvailable: mockTicket.quantityAvailable,
				createdAt: mockTicket.createdAt,
			}),
		} as NextRequest;

		const res = await POST(req);
		expect(res.status).toBe(201);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data).toBeDefined();
	});
});
