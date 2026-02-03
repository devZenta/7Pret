import prisma from "../../src/lib/prisma";

type Ingredient = { name: string; quantity: number; unit: string };

export const recipeService = {
	getAll: async () => {
		const recipes = await prisma.recipe.findMany({
			orderBy: { createdAt: "desc" },
		});
		return recipes.map((recipe) => ({
			...recipe,
			ingredients: recipe.ingredients as Ingredient[],
			steps: recipe.steps as string[],
			rating: Number(recipe.rating),
			createdAt: recipe.createdAt.toISOString(),
			updatedAt: recipe.updatedAt.toISOString(),
		}));
	},

	getById: async (id: number) => {
		const recipe = await prisma.recipe.findUnique({
			where: { id },
		});
		if (!recipe) return null;
		return {
			...recipe,
			ingredients: recipe.ingredients as Ingredient[],
			steps: recipe.steps as string[],
			rating: Number(recipe.rating),
			createdAt: recipe.createdAt.toISOString(),
			updatedAt: recipe.updatedAt.toISOString(),
		};
	},
};
