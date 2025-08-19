import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

export const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: (theme.vars ?? theme).palette.text.secondary,
	display: "flex",
	gap: 20,
}));
