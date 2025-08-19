// Core Packages
import { useMutation } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { METHODS } from "@src/utils/helper";
import { ListResponse, LoginCredential, RegisterCredential } from "../types";
// import { AxiosError } from "axios";

export const API = {
	LOGIN: "/user/login",
	LOGOUT: "/user/logout",
	REGISTER: "/auth",
};

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: async (body: LoginCredential) => {
			const response: ListResponse<null> = await apiHelper({
				url: API.LOGIN,
				requestType: METHODS.POST,
				data: body,
			});
			return response;
		},
	});
};

export const useRegisterMutation = () => {
	return useMutation({
		mutationFn: async (body: RegisterCredential) => {
			const response: ListResponse<null> = await apiHelper({
				url: API.REGISTER,
				requestType: METHODS.POST,
				data: body,
			});
			return response;
		},
	});
};

export const useLogoutMutation = () => {
	return useMutation({
		mutationFn: async () => {
			const response: ListResponse<null> = await apiHelper({
				url: API.LOGOUT,
				requestType: METHODS.POST,
			});
			return response;
		},
	});
};
