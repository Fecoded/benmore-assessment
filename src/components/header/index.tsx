import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { handlePathname, useLogoutMutation } from "@src/utils";
import { deleteCookie } from "cookies-next";

export const Header = () => {
	const { mutateAsync: logout } = useLogoutMutation();

	const handleLogout = () => {
		logout()
			.then(() => {
				deleteCookie("USER_TOKEN");
				if (typeof window !== "undefined") {
					if (window.location.pathname !== "/login") {
						window.location.href = handlePathname(window.location.pathname);
					}
				}
			})
			.catch((err) => console.error("error in logout", err));
	};

	return (
		<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
			<Typography variant="h5">EDT</Typography>
			<Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
				<Typography variant="body1" color="blue" sx={{ cursor: "pointer" }}>
					<Link href="/">Events</Link>
				</Typography>
				<Typography variant="body1" color="blue" sx={{ cursor: "pointer" }}>
					<Link href="/tickets">My Tickets</Link>
				</Typography>
				<Box onClick={handleLogout} sx={{ cursor: "pointer" }}>
					<Typography variant="body1" color="red" sx={{ cursor: "pointer" }}>
						Logout
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};
