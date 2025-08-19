// Core
import { Suspense } from "react";
import { Metadata } from "next";

// Layout
import { Tickets } from "@src/components";

export const metadata: Metadata = {
	title: "Tickets",
	description: "",
};

export default async function TicketsPage({}: { params: Promise<{ id: string }> }) {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<Tickets />
		</Suspense>
	);
}
