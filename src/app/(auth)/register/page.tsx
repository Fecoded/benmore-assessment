// Core
import { Suspense } from "react";
import { Metadata } from "next";

// Layout
import { AuthRegister } from "@src/components";

export const metadata: Metadata = {
	title: "Sign Up",
	description: "",
};

export default function RegisterPage() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<AuthRegister />
		</Suspense>
	);
}
