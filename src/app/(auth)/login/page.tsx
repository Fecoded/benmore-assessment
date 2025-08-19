// Core
import { Suspense } from "react";
import { Metadata } from "next";

// Layout
import { AuthLogin } from "@src/components";

export const metadata: Metadata = {
	title: "Login",
	description: "",
};

export default function LoginPage() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<AuthLogin />
		</Suspense>
	);
}