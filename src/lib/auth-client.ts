import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.PROD
		? "https://7pret-production.up.railway.app"
		: "http://localhost:5173",
});

export const { signIn, signUp, signOut, useSession } = authClient;
