import { Hono } from "hono";
import { auth } from "../../src/lib/auth";

const authApp = new Hono();

authApp.all("/*", (c) => {
	return auth.handler(c.req.raw);
});

export default authApp;
