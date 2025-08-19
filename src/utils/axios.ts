import axios from "axios";
import { deleteCookie } from "cookies-next";
import { handlePathname } from "./helper";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:3000/api",
});

// Interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		const statusCode = error?.response?.data?.statusCode;

		if (statusCode === 401) {
			deleteCookie("USER_TOKEN");
			if (typeof window !== "undefined") {
				if (window.location.pathname !== "/login") {
					window.location.href = handlePathname(window.location.pathname);
				}
			}
		}

		return Promise.reject(error);
	},
);
