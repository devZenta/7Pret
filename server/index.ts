import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import authApp from "./routes/auth";
import planningApp from "./routes/planning";
import recipesApp from "./routes/recipes.ts";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
	return c.text("Le serveur Hono est en ligne ! 🚀");
});

// --- MONTAGE DES ROUTES ---

// 1. Authentification (Better Auth)
// Routes dispo: POST /api/auth/sign-up, /api/auth/sign-in, etc.
app.route("/api/auth", authApp);

// 2. Recettes
app.route("/api/recipes", recipesApp);

// 3. Planning
app.route("/api/planning", planningApp);

export default {
	port: 3000,
	fetch: app.fetch,
};
