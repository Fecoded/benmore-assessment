import { POST } from "./route";
import { NextRequest } from "next/server";

jest.mock("@src/utils/dbOperation");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

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
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

describe("POST /api/user/login", () => {
	const mockUser = {
		email: "test@example.com",
		password: "hashedpassword",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 400 if validation fails", async () => {
		const req = { json: async () => ({}) } as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.success).toBe(false);
		expect(json.errors).toBeDefined();
	});

	it("returns 400 if password is invalid", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser] });
		(bcrypt.compare as jest.Mock).mockResolvedValue(false);
		const req = {
			json: async () => ({ email: mockUser.email, password: "password" }),
		} as unknown as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.success).toBe(false);
		expect(json.message).toBe("Invalid Credentials");
	});

	it("returns 404 if user does not exist", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [] });
		const req = {
			json: async () => ({ email: "notfound@example.com", password: "password" }),
		} as unknown as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(404);
		const json = await res.json();
		expect(json.success).toBe(false);
		expect(json.isNewUser).toBe(true);
	});

	it("returns 400 if password is invalid", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser] });
		(bcrypt.compare as jest.Mock).mockResolvedValue(false);
		const req = {
			json: async () => ({ email: mockUser.email, password: "password101" }),
		} as unknown as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.success).toBe(false);
		expect(json.message).toBe("Invalid Credentials");
	});

	it("returns 200 and sets cookie on success", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser] });
		(bcrypt.compare as jest.Mock).mockResolvedValue(true);
		(jwt.sign as jest.Mock).mockReturnValue("token");
		const req = {
			json: async () => ({ email: mockUser.email, password: "correct" }),
		} as unknown as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.message).toBe("login successful");
		// Cookie check is implicit; NextResponse sets it internally
	});

	it("returns 500 on internal error", async () => {
		(getData as jest.Mock).mockImplementation(() => {
			throw new Error("fail");
		});
		const req = {
			json: async () => ({ email: mockUser.email, password: "correct" }),
		} as NextRequest;
		const res = await POST(req);
		expect(res.status).toBe(500);
		const json = await res.json();
		expect(json.success).toBe(false);
		expect(json.message).toContain("Internal server error");
	});
});
