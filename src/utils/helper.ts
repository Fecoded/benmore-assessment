import { QueryClientConfig } from "@tanstack/react-query";

export const generateUUID = (): string =>
	String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g, (character) => {
		const random = (Math.random() * 16) | 0;
		const value = character === "x" ? random : (random & 0x3) | 0x8;

		return value.toString(16);
	});

export const extractToken = (authorization: string) => {
	if (authorization.substring(0, 6).toLocaleLowerCase() === "bearer") {
		return authorization.substring(7).trim();
	}
	throw new Error("unable to verify user");
};

export const handlePathname = (pathname: string) => {
	if (pathname === "/") {
		return "/login";
	}

	return `/login?redirect=${pathname}`;
};

export const METHODS = {
	POST: "POST",
	GET: "GET",
	PATCH: "PATCH",
	PUT: "PUT",
	DELETE: "DELETE",
};

export const queryClientConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			refetchOnMount: "always",
			refetchOnWindowFocus: "always",
			refetchOnReconnect: "always",
		},
		mutations: {},
	},
};
