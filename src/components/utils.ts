import * as yup from "yup";

export const LoginSchema = yup.object({
	email: yup.string().email("Enter a valid email").required("Email is required"),
	password: yup.string().required("Password is required"),
});

export const RegisterSchema = yup.object({
	name: yup.string().min(6, "Name must be more than 6 characters").required("Name is required"),
	email: yup.string().email("Enter a valid email").required("Email is required"),
	password: yup.string().required("Password is required"),
});
