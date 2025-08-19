import { z } from "zod";

export const UserSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
	email: z.email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const EventSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	date: z.iso.datetime(),
	venue: z.string().min(1, "Venue is required"),
});

export const TicketSchema = z.object({
	eventId: z.uuid(),
	price: z.string().min(1, "price is required"),
	quantityAvailable: z.string().min(1, "Quantity is required"),
});

export const OrderSchema = z.object({
	eventId: z.uuid(),
	ticketId: z.uuid(),
});

export const BookedTicketSchema = z.object({
	eventId: z.uuid(),
});
