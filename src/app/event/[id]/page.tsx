// Core
import { Suspense } from "react";
import { Metadata } from "next";

// Layout
import { EventDetails } from "@src/components";

export const metadata: Metadata = {
	title: "Event Details",
	description: "",
};

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
	const eventId = (await params).id;

	return (
		<Suspense fallback={<p>Loading...</p>}>
			<EventDetails eventId={eventId} />
		</Suspense>
	);
}
