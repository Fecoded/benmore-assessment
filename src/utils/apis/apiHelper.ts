import { axiosInstance as axios } from "../axios";
import { getCookie } from "cookies-next";

interface ApiHelperProps<T> {
	url: string;
	requestType?: string;
	data?: T;
	params?: Record<string, string> | null;
}

// interface ErrorResponse {
// 	message?: string;
// }

export const apiHelper = async <T>({
	url,
	requestType = "GET",
	data,
	params = null,
}: ApiHelperProps<T>) => {
	const accessToken = getCookie("USER_TOKEN");

	const options = {
		method: requestType,
		data,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	};

	if (params) {
		const query = new URLSearchParams(params);
		url = `${url}?${query.toString()}`;
	}

	const response = await axios(`${url}`, options);

	return response.data;
};
