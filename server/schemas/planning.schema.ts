import { z } from "@hono/zod-openapi";

export const MealSlotEnum = z.enum([
	"petit-dejeuner",
	"dejeuner",
	"diner",
	"collation",
]);
export const RecipeSourceEnum = z.enum(["predefined", "custom"]);

export const MealPlanningSchema = z
	.object({
		id: z
			.string()
			.uuid()
			.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		userId: z.string().openapi({ example: "user-123" }),
		date: z.string().openapi({ example: "2024-01-15" }),
		slot: z.string().nullable().openapi({ example: "diner" }),
		recipeId: z.string().openapi({ example: "recipe-456" }),
		source: z.string().openapi({ example: "predefined" }),
		createdAt: z
			.string()
			.datetime()
			.openapi({ example: "2024-01-01T00:00:00.000Z" }),
		updatedAt: z
			.string()
			.datetime()
			.openapi({ example: "2024-01-01T00:00:00.000Z" }),
	})
	.openapi("MealPlanning");

export const MealPlanningListSchema = z
	.array(MealPlanningSchema)
	.openapi("MealPlanningList");

export const CreateMealPlanningSchema = z
	.object({
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
			.openapi({ example: "2024-01-15" }),
		slot: MealSlotEnum.optional()
			.default("diner")
			.openapi({ example: "diner" }),
		recipeId: z.string().openapi({ example: "1" }),
		source: RecipeSourceEnum.openapi({ example: "predefined" }),
	})
	.openapi("CreateMealPlanning");

export const UpdateMealPlanningSchema = z
	.object({
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
			.optional()
			.openapi({ example: "2024-01-16" }),
		slot: MealSlotEnum.optional().openapi({ example: "dejeuner" }),
		recipeId: z.string().optional().openapi({ example: "2" }),
		source: RecipeSourceEnum.optional().openapi({ example: "custom" }),
	})
	.openapi("UpdateMealPlanning");
