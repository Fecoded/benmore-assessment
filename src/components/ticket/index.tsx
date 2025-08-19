"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Header } from "../header";
import moment from "moment";
import Image from "next/image";
import { Item } from "../styled";
import { useGetOrdersQuery } from "@src/utils/apis/event";
import { LoaderIcon } from "@src/utils";

const imgUrl = "https://images.unsplash.com/photo-1589118949245-7d38baf380d6";

export const Tickets = () => {
	const { data: orderData, isLoading: isOrderLoading } = useGetOrdersQuery();
	const tickets = orderData?.data || [];

	return (
		<Container
			maxWidth="lg"
			component="main"
			sx={{ display: "flex", flexDirection: "column", my: 5, gap: 4 }}
		>
			<Header />
			{isOrderLoading && <LoaderIcon />}

			{tickets.length > 0 ? (
				<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
					{tickets.map((item, idx) => (
						<Grid key={idx} size={5}>
							<Item>
								<Image
									src={`${imgUrl}?w=200&h=200&fit=crop&auto=format`}
									alt={item.event.title}
									loading="lazy"
									width={220}
									height={220}
								/>
								<Box gap={2} display="flex" flexDirection="column">
									<Typography variant="h5">
										{item.event.title}
									</Typography>
									<Box>
										<Typography variant="body1">Date</Typography>
										<Typography variant="body2" color="black">
											{moment(item.event.date).format("lll")}
										</Typography>
									</Box>
									<Box>
										<Typography variant="body1">Venue</Typography>
										<Typography variant="body2" color="black">
											{item.event.venue}
										</Typography>
									</Box>
									<Box>
										<Typography variant="body1">
											Ticket Type
										</Typography>
										<Typography variant="body2" color="black">
											{item.ticket.ticketType}
										</Typography>
									</Box>
								</Box>
							</Item>
						</Grid>
					))}
				</Grid>
			) : (
				!isOrderLoading && (
					<Typography textAlign="center">No Ticket available yet</Typography>
				)
			)}
		</Container>
	);
};
