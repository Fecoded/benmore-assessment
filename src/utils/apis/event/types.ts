export type User = {
	id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	createdAt: string;
};

export interface Event {
	id: string;
	title: string;
	description: string;
	date: string;
	venue: string;
	createdBy: string; // FK → User.id
	createdAt: string;
}

export type Ticket = {
	id: string;
	eventId: string; // FK → Events.id
	ticketType: string; // free / paid
	price: string;
	quantityAvailable: string;
	createdAt: string;
};

export interface EventDetails extends Event {
	tickets: Ticket[];
}

export type OrderPayload = {
	eventId: string;
	ticketId: string;
};

export type OrderResponse = {
	id: string;
	user: User;
	event: Event;
	ticket: Ticket;
	status: string;
	createdAt: string;
};
