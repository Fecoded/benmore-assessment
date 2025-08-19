"use client";

import Typography from "@mui/material/Typography";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { Formik, useFormik } from "formik";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { LoginSchema } from "../utils";
import { useLoginMutation } from "@src/utils/apis/user";
import { Card, SignInContainer } from "../styled";
import Link from "@mui/material/Link";
import { useRouter } from "next/navigation";

export const AuthLogin = () => {
	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const router = useRouter();

	// Formik setup
	const { initialValues, handleSubmit, errors, touched, values, setFieldValue } = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: LoginSchema,
		validateOnMount: true,
		onSubmit: () => handleLogin(),
	});

	const { mutateAsync: loginUser, isPending: isLoginLoading } = useLoginMutation();

	const handleLogin = () => {
		loginUser(values)
			.then(() => {
				router.replace("/");
			})
			.catch((err) => {
				setOpen(true);
				setErrorMessage(err?.response?.data?.message || err?.message);
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
					Sign in
				</Typography>
				<Formik initialValues={initialValues} onSubmit={() => {}}>
					{() => (
						<>
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
								Sign in
							</Button>
							<Typography sx={{ textAlign: "center" }}>
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									variant="body2"
									sx={{ alignSelf: "center" }}
								>
									Sign up
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
				message={errorMessage}
			/>
		</SignInContainer>
	);
};
