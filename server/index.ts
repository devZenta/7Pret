import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import authApp from "./routes/auth";
import customRecipesApp from "./routes/customRecipes";
import planningApp from "./routes/planning";
import recipesApp from "./routes/recipes";

const app = new OpenAPIHono();

app.use("*", logger());
app.use(
	"*",
	cors({
		origin: [
			"http://localhost:5173",
			"https://7pret-production.up.railway.app",
		],
		credentials: true,
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	}),
);

// --- API ROUTES ---
app.route("/api/auth", authApp);
app.route("/api/recipes", recipesApp);
app.route("/api/custom-recipes", customRecipesApp);
app.route("/api/planning", planningApp);

// --- OPENAPI DOCUMENTATION ---
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		title: "7Pret API",
		version: "1.0.0",
		description: "API de planification de repas",
	},
	servers: [
		{
			url: "http://localhost:3000",
			description: "Development server",
		},
		{
			url: "https://7pret-production.up.railway.app",
			description: "Production server",
		},
	],
	tags: [
		{ name: "Recipes", description: "Predefined recipes (read-only)" },
		{ name: "Custom Recipes", description: "User custom recipes (CRUD)" },
		{ name: "Planning", description: "Meal planning (CRUD)" },
	],
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

// --- STATIC FILES (Production) ---
app.use("/*", serveStatic({ root: "./dist" }));

app.get("*", serveStatic({ path: "./dist/index.html" }));

const port = Number(process.env.PORT) || 3000;

export type AppType = typeof app;

export default {
	port,
	fetch: app.fetch,
};
