import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { type AuthVariables, authMiddleware } from "../middleware/auth";
import {
	ErrorResponseSchema,
	SuccessResponseSchema,
} from "../schemas/common.schema";
import {
	CreateMealPlanningSchema,
	MealPlanningListSchema,
	MealPlanningSchema,
	UpdateMealPlanningSchema,
} from "../schemas/planning.schema";
import { planningService } from "../services/planningService";

const planningApp = new OpenAPIHono<{ Variables: AuthVariables }>();

planningApp.use("*", authMiddleware);

const getMyPlanningRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Planning"],
	summary: "Get my meal planning",
	description: "Returns all meal planning entries for the authenticated user",
	security: [{ cookieAuth: [] }],
	responses: {
		200: {
			description: "List of meal planning entries",
			content: {
				"application/json": {
					schema: MealPlanningListSchema,
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

const getMealByIdRoute = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Planning"],
	summary: "Get a meal planning entry by ID",
	description: "Returns a single meal planning entry by its ID",
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
			description: "Meal planning entry found",
			content: {
				"application/json": {
					schema: MealPlanningSchema,
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
			description: "Meal planning entry not found",
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

const addMealRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Planning"],
	summary: "Add a meal to planning",
	description: "Adds a new meal to the authenticated user's planning",
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: CreateMealPlanningSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Meal added to planning",
			content: {
				"application/json": {
					schema: MealPlanningSchema,
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

const updateMealRoute = createRoute({
	method: "patch",
	path: "/{id}",
	tags: ["Planning"],
	summary: "Update a meal in planning",
	description: "Updates an existing meal in the authenticated user's planning",
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
					schema: UpdateMealPlanningSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Meal updated",
			content: {
				"application/json": {
					schema: MealPlanningSchema,
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
			description: "Meal not found",
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

const deleteMealRoute = createRoute({
	method: "delete",
	path: "/{id}",
	tags: ["Planning"],
	summary: "Delete a meal from planning",
	description: "Removes a meal from the authenticated user's planning",
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
			description: "Meal deleted",
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
			description: "Meal not found",
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

planningApp.openapi(getMyPlanningRoute, async (c) => {
	try {
		const user = c.get("user");
		const planning = await planningService.getUserPlanning(user.id);
		return c.json(planning, 200);
	} catch (_e) {
		return c.json({ success: false, message: "Failed to fetch planning" }, 500);
	}
});

planningApp.openapi(getMealByIdRoute, async (c) => {
	try {
		const user = c.get("user");
		const id = c.req.param("id");
		const meal = await planningService.getById(id, user.id);

		if (!meal) {
			return c.json({ success: false, message: "Meal not found" }, 404);
		}

		return c.json(meal, 200);
	} catch (_e) {
		return c.json({ success: false, message: "Failed to fetch meal" }, 500);
	}
});

planningApp.openapi(addMealRoute, async (c) => {
	try {
		const user = c.get("user");
		const body = c.req.valid("json");
		const meal = await planningService.addMeal(user.id, body);
		return c.json(meal, 201);
	} catch (_e) {
		return c.json(
			{ success: false, message: "Failed to add meal to planning" },
			500,
		);
	}
});

planningApp.openapi(updateMealRoute, async (c) => {
	try {
		const user = c.get("user");
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const meal = await planningService.updateMeal(id, user.id, body);

		if (!meal) {
			return c.json({ success: false, message: "Meal not found" }, 404);
		}

		return c.json(meal, 200);
	} catch (_e) {
		return c.json({ success: false, message: "Failed to update meal" }, 500);
	}
});

planningApp.openapi(deleteMealRoute, async (c) => {
	try {
		const user = c.get("user");
		const id = c.req.param("id");
		const deleted = await planningService.removeMeal(id, user.id);

		if (!deleted) {
			return c.json({ success: false, message: "Meal not found" }, 404);
		}

		return c.json(
			{ success: true, message: "Meal deleted from planning" },
			200,
		);
	} catch (_e) {
		return c.json({ success: false, message: "Failed to delete meal" }, 500);
	}
});

export default planningApp;
