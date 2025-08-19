"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import moment from "moment";
import Image from "next/image";
import { Item } from "../styled";
import Button from "@mui/material/Button";
import {
	useCheckTicketStatusQuery,
	useCreateOrderMutation,
	useGetEventQuery,
} from "@src/utils/apis/event";
import { LoaderIcon } from "@src/utils";
import { Header } from "@src/components";

const imgUrl = "https://images.unsplash.com/photo-1589118949245-7d38baf380d6";

export const EventDetails = ({ eventId }: { eventId: string }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");

	const { data: eventData, isLoading: isEventLoading } = useGetEventQuery(eventId ?? "");
	const event = eventData?.data;

	const { mutateAsync: createOrder, isPending: isCreateOrderLoading } = useCreateOrderMutation();

	const { data: orderData, isLoading: isCheckTicketStatusPending } =
		useCheckTicketStatusQuery(eventId);

	const isBooked = orderData?.data?.isBooked;

	const handleCreateOrder = (eventId: string, ticketId: string) => {
		createOrder({
			eventId,
			ticketId,
		})
			.then((res) => {
				setOpen(true);
				setMessage(res?.message);
			})
			.catch((err) => console.error(err?.response?.data?.message));
	};

	return (
		<Container
			maxWidth="lg"
			component="main"
			sx={{ display: "flex", flexDirection: "column", my: 5, gap: 4 }}
		>
			<Header />
			{isEventLoading ? (
				<LoaderIcon />
			) : (
				<Item
					sx={{
						display: "block",
						width: "38%",
						margin: "auto",
					}}
				>
					<Image
						src={`${imgUrl}`}
						alt={event?.title ?? ""}
						loading="lazy"
						objectFit="cover"
						style={{ width: "100%" }}
						width={300}
						height={300}
					/>
					<Box gap={2} display="flex" flexDirection="column">
						<Typography variant="h5">{event?.title}</Typography>
						<Box>
							<Typography variant="body1">Date</Typography>
							<Typography variant="body2" color="black">
								{moment(event?.date).format("lll")}
							</Typography>
						</Box>
						<Box>
							<Typography variant="body1">Venue</Typography>
							<Typography variant="body2" color="black">
								{event?.venue}
							</Typography>
						</Box>
						{event?.tickets.map((ticket) => (
							<Box
								display="flex"
								flexDirection="column"
								alignItems="flex-start"
								key={ticket.id}
								sx={{
									border: "1px solid #f7f7f7",
									borderRadius: "20px",
									p: 2,
								}}
								gap={2}
							>
								<Box>
									<Typography variant="body1">Ticket type</Typography>
									<Typography variant="body2" color="black">
										{ticket?.ticketType}
									</Typography>
								</Box>
								<Box>
									<Typography variant="body1">
										Quantity Available
									</Typography>
									<Typography variant="body2" color="black">
										{ticket?.quantityAvailable}
									</Typography>
								</Box>
								{}
								<Button
									type="button"
									variant="outlined"
									disabled={isBooked}
									loading={
										isCreateOrderLoading || isCheckTicketStatusPending
									}
									onClick={() =>
										isBooked
											? {}
											: handleCreateOrder(event.id, ticket.id)
									}
								>
									{isBooked ? "Booked" : "Register"}
								</Button>
							</Box>
						))}
					</Box>
				</Item>
			)}
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={open}
				autoHideDuration={1500}
				onClose={() => setOpen(false)}
				message={message}
			/>
		</Container>
	);
};
