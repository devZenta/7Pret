import { hc } from "hono/client";
import type { AppType } from "../../server/index";

const baseUrl = import.meta.env.PROD
	? "https://7pret-production.up.railway.app"
	: "http://localhost:3000";

export const api = hc<AppType>(baseUrl, {
	init: {
		credentials: "include",
	},
});
