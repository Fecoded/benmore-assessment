// Core Packages
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHelper } from "../apiHelper";
import { METHODS } from "@src/utils/helper";
import { ListResponse } from "../types";
import { Event, EventDetails, OrderPayload, OrderResponse } from "./types";

const API = {
	EVENTS: "/event",
	ORDER: "/order",
	TICKET_BOOK: "/ticket/book",
};

export const useGetEventsQuery = () => {
	return useQuery<ListResponse<Event[]>>({
		queryKey: [API.EVENTS],
		queryFn: async () => {
			const res = await apiHelper({
				url: API.EVENTS,
				requestType: METHODS.GET,
			});

			return res;
		},
	});
};

export const useGetEventQuery = (id: string) => {
	return useQuery({
		queryKey: [API.EVENTS, id],
		queryFn: async () => {
			const res: ListResponse<EventDetails> = await apiHelper({
				url: `${API.EVENTS}/${id}`,
				requestType: METHODS.GET,
			});

			return res;
		},
		enabled: !!id,
	});
};

export const useCreateOrderMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: OrderPayload) => {
			const response: ListResponse<null> = await apiHelper({
				url: API.ORDER,
				requestType: METHODS.POST,
				data: body,
			});
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [API.TICKET_BOOK] });
		},
	});
};

export const useGetOrdersQuery = () => {
	return useQuery({
		queryKey: [API.ORDER],
		queryFn: async () => {
			const res: ListResponse<OrderResponse[]> = await apiHelper({
				url: API.ORDER,
				requestType: METHODS.GET,
			});

			return res;
		},
	});
};

export const useCheckTicketStatusQuery = (eventId: string) => {
	return useQuery({
		queryKey: [API.TICKET_BOOK, eventId],
		queryFn: async () => {
			const response: ListResponse<{ isBooked: boolean }> = await apiHelper({
				url: API.TICKET_BOOK,
				requestType: METHODS.POST,
				data: { eventId },
			});
			return response;
		},
		enabled: !!eventId,
	});
};
