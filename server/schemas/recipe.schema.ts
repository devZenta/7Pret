import { z } from "@hono/zod-openapi";

export const IngredientSchema = z
	.object({
		name: z.string().openapi({ example: "Riz arborio" }),
		quantity: z.number().openapi({ example: 300 }),
		unit: z.string().openapi({ example: "g" }),
	})
	.openapi("Ingredient");

export const RecipeSchema = z
	.object({
		id: z.number().openapi({ example: 1 }),
		name: z.string().openapi({ example: "Risotto aux champignons" }),
		type: z.string().openapi({ example: "plat" }),
		cuisine: z.string().openapi({ example: "Italienne" }),
		difficulty: z.string().openapi({ example: "Moyen" }),
		prepTime: z.number().openapi({ example: 15 }),
		cookTime: z.number().openapi({ example: 30 }),
		servings: z.number().openapi({ example: 4 }),
		image: z
			.string()
			.nullable()
			.openapi({ example: "https://example.com/image.jpg" }),
		ingredients: z.array(IngredientSchema),
		steps: z.array(z.string()),
		rating: z.number().openapi({ example: 4.5 }),
		createdAt: z
			.string()
			.datetime()
			.openapi({ example: "2024-01-01T00:00:00.000Z" }),
		updatedAt: z
			.string()
			.datetime()
			.openapi({ example: "2024-01-01T00:00:00.000Z" }),
	})
	.openapi("Recipe");

export const RecipeListSchema = z.array(RecipeSchema).openapi("RecipeList");
