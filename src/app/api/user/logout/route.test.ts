import { POST } from "./route";

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
					delete: jest.fn(),
				},
				async json() {
					return data;
				},
			}),
		},
	};
});

describe("POST api/user/logout", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("return 200 if logout was successful", async () => {
		const res = await POST();
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.success).toBe(true);
		expect(json.message).toBe("logout successful");
	});
});
