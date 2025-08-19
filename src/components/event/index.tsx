"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";
import Image from "next/image";
import { Item } from "./styled";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useGetEventsQuery } from "@src/utils/apis/event";
import { LoaderIcon } from "@src/utils";
import { Header } from "../header";

const imgUrl = "https://images.unsplash.com/photo-1589118949245-7d38baf380d6";

export const Events = () => {
	const router = useRouter();

	const { data: eventData, isLoading: isEventLoading } = useGetEventsQuery();
	const events = eventData?.data || [];

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
				<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
					{events.map((event, idx) => (
						<Grid key={idx} size={5}>
							<Item>
								<Image
									src={`${imgUrl}?w=200&h=200&fit=crop&auto=format`}
									alt={event.title}
									loading="lazy"
									width={220}
									height={220}
								/>
								<Box gap={2} display="flex" flexDirection="column">
									<Typography variant="h5">{event.title}</Typography>
									<Box>
										<Typography variant="body1">Date</Typography>
										<Typography variant="body2" color="black">
											{moment(event.date).format("lll")}
										</Typography>
									</Box>
									<Box>
										<Typography variant="body1">Venue</Typography>
										<Typography variant="body2" color="black">
											{event.venue}
										</Typography>
									</Box>
									<Button
										type="button"
										fullWidth
										variant="outlined"
										onClick={() => router.push(`/event/${event.id}`)}
									>
										View Details
									</Button>
								</Box>
							</Item>
						</Grid>
					))}
				</Grid>
			)}
		</Container>
	);
};
