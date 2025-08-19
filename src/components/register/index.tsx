"use client";

import Typography from "@mui/material/Typography";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { Formik, useFormik } from "formik";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { RegisterSchema } from "../utils";
import { useRegisterMutation } from "@src/utils/apis/user";
import { Card, SignInContainer } from "../styled";
import Link from "@mui/material/Link";
import { useRouter } from "next/navigation";

export const AuthRegister = () => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");

	const router = useRouter();

	// Formik setup
	const { initialValues, handleSubmit, errors, touched, values, setFieldValue } = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
		},
		validationSchema: RegisterSchema,
		validateOnMount: true,
		onSubmit: () => handleLogin(),
	});

	const { mutateAsync: registerUser, isPending: isLoginLoading } = useRegisterMutation();

	const handleLogin = () => {
		registerUser(values)
			.then((res) => {
				router.push("/login");
				setMessage(res.message);
			})
			.catch((err) => {
				setOpen(true);
				setMessage(err?.response?.data?.message || err?.message);
			});
	};

	return (
		<SignInContainer direction="column" justifyContent="space-between">
			<Card variant="outlined">
				<Typography
					component="p"
					variant="body1"
					sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
				>
					Register
				</Typography>
				<Formik initialValues={initialValues} onSubmit={() => {}}>
					{() => (
						<>
							<FormControl>
								<FormLabel htmlFor="name">Full name</FormLabel>
								<TextField
									error={!!errors.name && touched.name}
									helperText={
										!!errors.name && touched.name && errors.name
									}
									id="name"
									type="name"
									name="name"
									placeholder="John doe"
									autoComplete="name"
									autoFocus
									required
									fullWidth
									variant="outlined"
									color={
										!!errors.name && touched.name
											? "error"
											: "primary"
									}
									value={values.name}
									onChange={(e) => {
										const name = (e.target as HTMLInputElement).value;
										setFieldValue("name", name);
									}}
								/>
							</FormControl>
							<FormControl>
								<FormLabel htmlFor="email">Email</FormLabel>
								<TextField
									error={!!errors.email && touched.email}
									helperText={
										!!errors.email && touched.email && errors.email
									}
									id="email"
									type="email"
									name="email"
									placeholder="your@email.com"
									autoComplete="email"
									autoFocus
									required
									fullWidth
									variant="outlined"
									color={
										!!errors.email && touched.email
											? "error"
											: "primary"
									}
									value={values.email}
									onChange={(e) => {
										const email = (e.target as HTMLInputElement)
											.value;
										setFieldValue("email", email);
									}}
								/>
							</FormControl>
							<FormControl>
								<FormLabel htmlFor="password">Password</FormLabel>
								<TextField
									error={!!errors.password && touched.password}
									helperText={
										!!errors.password &&
										touched.password &&
										errors.password
									}
									name="password"
									placeholder="••••••"
									type="password"
									id="password"
									autoComplete="current-password"
									autoFocus
									required
									fullWidth
									variant="outlined"
									color={
										!!errors.password && touched.password
											? "error"
											: "primary"
									}
									onChange={(e) => {
										const password = (e.target as HTMLInputElement)
											.value;
										setFieldValue("password", password);
									}}
								/>
							</FormControl>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								onClick={() => handleSubmit()}
								loading={isLoginLoading}
							>
								Submit
							</Button>
							<Typography sx={{ textAlign: "center" }}>
								Already have an account?{" "}
								<Link
									href="/login"
									variant="body2"
									sx={{ alignSelf: "center" }}
								>
									Sign in
								</Link>
							</Typography>
						</>
					)}
				</Formik>
			</Card>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={open}
				autoHideDuration={1500}
				onClose={() => setOpen(false)}
				message={message}
			/>
		</SignInContainer>
	);
};
