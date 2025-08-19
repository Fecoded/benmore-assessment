import { extractToken } from "./helper";
import * as jwt from "jsonwebtoken";
import { DB, User } from "./types";

export const authenticateUser = (req: Request, db: DB): User => {
	const jwtToken = req.headers.get("authorization") as string;

	const extractedToken = extractToken(jwtToken);

	const extractedPayload = jwt.verify(extractedToken, "secret") as { userId: string };

	const user = db.users.find((user) => user.id === extractedPayload.userId);

	return user as User;
};
