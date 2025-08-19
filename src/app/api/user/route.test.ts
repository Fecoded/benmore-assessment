import { GET } from "./route";
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

describe("GET api/user", () => {
	const mockUser = {
		name: "test",
		role: "User",
		email: "test@example.com",
		password: "hashedpassword",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("returns 200 and get user details", async () => {
		(getData as jest.Mock).mockReturnValue({ users: [mockUser] });
		(authenticateUser as jest.Mock).mockResolvedValue(false);
		const req = { json: async () => ({}) } as NextRequest;
		const res = await GET(req);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.data).toBeDefined();
	});
});
