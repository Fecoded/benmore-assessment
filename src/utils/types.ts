export type User = {
	id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	createdAt: string;
};

export type Event = {
	id: string;
	title: string;
	description: string;
	date: string;
	venue: string;
	createdBy: string; // FK → User.id
	createdAt: string;
};

export type Ticket = {
	id: string;
	eventId: string; // FK → Events.id
	ticketType: string; // free / paid
	price: string;
	quantityAvailable: string;
	createdAt: string;
};

export type Order = {
	id: string;
	userId: string; // FK → User.id
	eventId: string; // FK → Events.id
	ticketId: string; // FK → Tickets.id
	status: string; // paid / confirmed / cancelled
	createdAt: string;
};

export type DB = {
	users: User[];
	events: Event[];
	tickets: Ticket[];
	orders: Order[];
};
