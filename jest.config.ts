import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
	coverageProvider: "v8",
	// Add more setup options before each test is run
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		// Handle module aliases
		"^@src/(.*)$": "<rootDir>/src/$1",

		// Handle @next/font
		"@next/font/(.*)": `<rootDir>/__mocks__/nextFontMock.js`,
		// Handle next/font
		"next/font/(.*)": `<rootDir>/__mocks__/nextFontMock.js`,
		// Disable server-only
		"server-only": `<rootDir>/__mocks__/empty.js`,
	},
	testEnvironment: "jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
