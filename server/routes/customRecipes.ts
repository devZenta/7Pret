import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { type AuthVariables, authMiddleware } from "../middleware/auth";
import {
	ErrorResponseSchema,
	SuccessResponseSchema,
} from "../schemas/common.schema";
import {
	CreateCustomRecipeSchema,
	CustomRecipeListSchema,
	CustomRecipeSchema,
	UpdateCustomRecipeSchema,
} from "../schemas/customRecipe.schema";
import { customRecipeService } from "../services/customRecipeService";

const customRecipesApp = new OpenAPIHono<{ Variables: AuthVariables }>();

customRecipesApp.use("*", authMiddleware);

const getAllCustomRecipesRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Custom Recipes"],
	summary: "Get all my custom recipes",
	description: "Returns all custom recipes for the authenticated user",
	security: [{ cookieAuth: [] }],
	responses: {
		200: {
			description: "List of custom recipes",
			content: {
				"application/json": {
					schema: CustomRecipeListSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
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

const getCustomRecipeByIdRoute = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Custom Recipes"],
	summary: "Get a custom recipe by ID",
	description:
		"Returns a single custom recipe by its ID (must belong to the authenticated user)",
	security: [{ cookieAuth: [] }],
	request: {
		params: z.object({
			id: z
				.string()
				.uuid()
				.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		}),
	},
	responses: {
		200: {
			description: "Custom recipe found",
			content: {
				"application/json": {
					schema: CustomRecipeSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		404: {
			description: "Custom recipe not found",
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

const createCustomRecipeRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Custom Recipes"],
	summary: "Create a custom recipe",
	description: "Creates a new custom recipe for the authenticated user",
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: CreateCustomRecipeSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Custom recipe created",
			content: {
				"application/json": {
					schema: CustomRecipeSchema,
				},
			},
		},
		400: {
			description: "Invalid request body",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
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

const updateCustomRecipeRoute = createRoute({
	method: "patch",
	path: "/{id}",
	tags: ["Custom Recipes"],
	summary: "Update a custom recipe",
	description:
		"Updates an existing custom recipe (must belong to the authenticated user)",
	security: [{ cookieAuth: [] }],
	request: {
		params: z.object({
			id: z
				.string()
				.uuid()
				.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		}),
		body: {
			content: {
				"application/json": {
					schema: UpdateCustomRecipeSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Custom recipe updated",
			content: {
				"application/json": {
					schema: CustomRecipeSchema,
				},
			},
		},
		400: {
			description: "Invalid request body",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		404: {
			description: "Custom recipe not found",
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

const deleteCustomRecipeRoute = createRoute({
	method: "delete",
	path: "/{id}",
	tags: ["Custom Recipes"],
	summary: "Delete a custom recipe",
	description:
		"Deletes a custom recipe (must belong to the authenticated user)",
	security: [{ cookieAuth: [] }],
	request: {
		params: z.object({
			id: z
				.string()
				.uuid()
				.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		}),
	},
	responses: {
		200: {
			description: "Custom recipe deleted",
			content: {
				"application/json": {
					schema: SuccessResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
		404: {
			description: "Custom recipe not found",
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

customRecipesApp.openapi(getAllCustomRecipesRoute, async (c) => {
	try {
		const user = c.get("user");
		const recipes = await customRecipeService.getAll(user.id);
		return c.json(recipes, 200);
	} catch (_e) {
		return c.json(
			{ success: false, message: "Failed to fetch custom recipes" },
			500,
		);
	}
});

customRecipesApp.openapi(getCustomRecipeByIdRoute, async (c) => {
	try {
		const user = c.get("user");
		const id = c.req.param("id");
		const recipe = await customRecipeService.getById(id, user.id);

		if (!recipe) {
			return c.json(
				{ success: false, message: "Custom recipe not found" },
				404,
			);
		}

		return c.json(recipe, 200);
	} catch (_e) {
		return c.json(
			{ success: false, message: "Failed to fetch custom recipe" },
			500,
		);
	}
});

customRecipesApp.openapi(createCustomRecipeRoute, async (c) => {
	try {
		const user = c.get("user");
		const body = c.req.valid("json");
		const recipe = await customRecipeService.create(user.id, body);
		return c.json(recipe, 201);
	} catch (_e) {
		return c.json(
			{ success: false, message: "Failed to create custom recipe" },
			500,
		);
	}
});

customRecipesApp.openapi(updateCustomRecipeRoute, async (c) => {
	try {
		const user = c.get("user");
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const recipe = await customRecipeService.update(id, user.id, body);

		if (!recipe) {
			return c.json(
				{ success: false, message: "Custom recipe not found" },
				404,
			);
		}

		return c.json(recipe, 200);
	} catch (_e) {
		return c.json(
			{ success: false, message: "Failed to update custom recipe" },
			500,
		);
	}
});

customRecipesApp.openapi(deleteCustomRecipeRoute, async (c) => {
	try {
		const user = c.get("user");
		const id = c.req.param("id");
		const deleted = await customRecipeService.delete(id, user.id);

		if (!deleted) {
			return c.json(
				{ success: false, message: "Custom recipe not found" },
				404,
			);
		}

		return c.json({ success: true, message: "Custom recipe deleted" }, 200);
	} catch (_e) {
		return c.json(
			{ success: false, message: "Failed to delete custom recipe" },
			500,
		);
	}
});

export default customRecipesApp;
