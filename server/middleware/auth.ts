import { createMiddleware } from "hono/factory";
import { auth } from "../../src/lib/auth";

type AuthVariables = {
	user: typeof auth.$Infer.Session.user;
	session: typeof auth.$Infer.Session.session;
};

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
	async (c, next) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session) {
			return c.json({ success: false, message: "Unauthorized" }, 401);
		}

		c.set("user", session.user);
		c.set("session", session.session);
		await next();
	},
);

export type { AuthVariables };
