export type ListResponse<T> = {
	status: boolean;
	message: string;
	data: T;
};

export type LoginCredential = {
	email: string;
	password: string;
};

export type RegisterCredential = {
	name: string;
	email: string;
	password: string;
};
