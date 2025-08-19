import { POST } from "./route";
import { NextRequest } from "next/server";

jest.mock("@src/utils/dbOperation");
jest.mock("@src/utils", () => ({
	...jest.requireActual("@src/utils"),
	generateUUID: jest.fn(() => "mock-uuid"),
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

describe("POST api/auth", () => {
	const mockUser = {
		name: "test",
		email: "test@example.com",
		password: "hashedpassword",
		role: "User",
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

	it("return 200 and newly created user", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser] });

		const req = {
			json: async () => ({
				name: mockUser.name,
				email: mockUser.email,
				password: "correct",
				role: mockUser.role,
			}),
		} as NextRequest;

		const res = await POST(req);
		expect(res.status).toBe(201);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data).toBeDefined();
	});
});
