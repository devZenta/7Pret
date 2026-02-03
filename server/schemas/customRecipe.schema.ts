import { z } from "@hono/zod-openapi";
import { IngredientSchema } from "./recipe.schema";

export const CustomRecipeSchema = z
	.object({
		id: z
			.string()
			.uuid()
			.openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
		userId: z.string().openapi({ example: "user-123" }),
		name: z.string().openapi({ example: "Ma recette maison" }),
		type: z.string().nullable().openapi({ example: "plat" }),
		cuisine: z.string().nullable().openapi({ example: "Française" }),
		difficulty: z.string().nullable().openapi({ example: "Facile" }),
		prepTime: z.number().nullable().openapi({ example: 20 }),
		cookTime: z.number().nullable().openapi({ example: 45 }),
		servings: z.number().nullable().openapi({ example: 4 }),
		image: z
			.string()
			.nullable()
			.openapi({ example: "https://example.com/image.jpg" }),
		ingredients: z.array(IngredientSchema).nullable(),
		steps: z.array(z.string()).nullable(),
		rating: z.number().nullable().openapi({ example: 4.0 }),
		createdAt: z
			.string()
			.datetime()
			.openapi({ example: "2024-01-01T00:00:00.000Z" }),
		updatedAt: z
			.string()
			.datetime()
			.openapi({ example: "2024-01-01T00:00:00.000Z" }),
	})
	.openapi("CustomRecipe");

export const CustomRecipeListSchema = z
	.array(CustomRecipeSchema)
	.openapi("CustomRecipeList");

export const CreateCustomRecipeSchema = z
	.object({
		name: z.string().min(1).openapi({ example: "Ma nouvelle recette" }),
		type: z.string().optional().openapi({ example: "plat" }),
		cuisine: z.string().optional().openapi({ example: "Française" }),
		difficulty: z.string().optional().openapi({ example: "Facile" }),
		prepTime: z.number().optional().openapi({ example: 20 }),
		cookTime: z.number().optional().openapi({ example: 45 }),
		servings: z.number().optional().openapi({ example: 4 }),
		image: z
			.string()
			.url()
			.optional()
			.openapi({ example: "https://example.com/image.jpg" }),
		ingredients: z
			.array(
				z.object({
					name: z.string(),
					quantity: z.number(),
					unit: z.string(),
				}),
			)
			.optional(),
		steps: z.array(z.string()).optional(),
	})
	.openapi("CreateCustomRecipe");

export const UpdateCustomRecipeSchema = z
	.object({
		name: z.string().min(1).optional().openapi({ example: "Recette modifiée" }),
		type: z.string().optional().openapi({ example: "dessert" }),
		cuisine: z.string().optional().openapi({ example: "Italienne" }),
		difficulty: z.string().optional().openapi({ example: "Moyen" }),
		prepTime: z.number().optional().openapi({ example: 30 }),
		cookTime: z.number().optional().openapi({ example: 60 }),
		servings: z.number().optional().openapi({ example: 6 }),
		image: z
			.string()
			.url()
			.optional()
			.openapi({ example: "https://example.com/new-image.jpg" }),
		ingredients: z
			.array(
				z.object({
					name: z.string(),
					quantity: z.number(),
					unit: z.string(),
				}),
			)
			.optional(),
		steps: z.array(z.string()).optional(),
	})
	.openapi("UpdateCustomRecipe");
