import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ErrorResponseSchema } from "../schemas/common.schema";
import { RecipeListSchema, RecipeSchema } from "../schemas/recipe.schema";
import { recipeService } from "../services/recipeService";

const recipesApp = new OpenAPIHono();

const getAllRecipesRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Recipes"],
	summary: "Get all predefined recipes",
	description: "Returns all predefined recipes from the database",
	responses: {
		200: {
			description: "List of recipes",
			content: {
				"application/json": {
					schema: RecipeListSchema,
				},
			},
		},
		500: {
			description: "Server error",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

const getRecipeByIdRoute = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Recipes"],
	summary: "Get a recipe by ID",
	description: "Returns a single predefined recipe by its ID",
	request: {
		params: z.object({
			id: z.string().regex(/^\d+$/).openapi({ example: "1" }),
		}),
	},
	responses: {
		200: {
			description: "Recipe found",
			content: {
				"application/json": {
					schema: RecipeSchema,
				},
			},
		},
		404: {
			description: "Recipe not found",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		500: {
			description: "Server error",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

recipesApp.openapi(getAllRecipesRoute, async (c) => {
	try {
		const recipes = await recipeService.getAll();
		return c.json(recipes, 200);
	} catch (_e) {
		return c.json({ success: false, message: "Failed to fetch recipes" }, 500);
	}
});

recipesApp.openapi(getRecipeByIdRoute, async (c) => {
	try {
		const id = Number.parseInt(c.req.param("id"), 10);
		const recipe = await recipeService.getById(id);

		if (!recipe) {
			return c.json({ success: false, message: "Recipe not found" }, 404);
		}

		return c.json(recipe, 200);
	} catch (_e) {
		return c.json({ success: false, message: "Failed to fetch recipe" }, 500);
	}
});

export default recipesApp;
