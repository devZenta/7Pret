import prisma from "../../src/lib/prisma";

type Ingredient = { name: string; quantity: number; unit: string };

type CreateCustomRecipeInput = {
	name: string;
	type?: string;
	cuisine?: string;
	difficulty?: string;
	prepTime?: number;
	cookTime?: number;
	servings?: number;
	image?: string;
	ingredients?: Ingredient[];
	steps?: string[];
};

type UpdateCustomRecipeInput = Partial<CreateCustomRecipeInput>;

const transformRecipe = (
	recipe: Awaited<ReturnType<typeof prisma.customRecipe.findFirst>>,
) => {
	if (!recipe) return null;
	return {
		...recipe,
		ingredients: (recipe.ingredients as Ingredient[] | null) ?? null,
		steps: (recipe.steps as string[] | null) ?? null,
		rating: recipe.rating ? Number(recipe.rating) : null,
		createdAt: recipe.createdAt.toISOString(),
		updatedAt: recipe.updatedAt.toISOString(),
	};
};

export const customRecipeService = {
	getAll: async (userId: string) => {
		const recipes = await prisma.customRecipe.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});
		return recipes.map((recipe) => ({
			...recipe,
			ingredients: (recipe.ingredients as Ingredient[] | null) ?? null,
			steps: (recipe.steps as string[] | null) ?? null,
			rating: recipe.rating ? Number(recipe.rating) : null,
			createdAt: recipe.createdAt.toISOString(),
			updatedAt: recipe.updatedAt.toISOString(),
		}));
	},

	getById: async (id: string, userId: string) => {
		const recipe = await prisma.customRecipe.findFirst({
			where: { id, userId },
		});
		return transformRecipe(recipe);
	},

	create: async (userId: string, data: CreateCustomRecipeInput) => {
		const recipe = await prisma.customRecipe.create({
			data: {
				userId,
				name: data.name,
				type: data.type,
				cuisine: data.cuisine,
				difficulty: data.difficulty,
				prepTime: data.prepTime,
				cookTime: data.cookTime,
				servings: data.servings,
				image: data.image,
				ingredients: data.ingredients ?? [],
				steps: data.steps ?? [],
			},
		});
		return {
			...recipe,
			ingredients: (recipe.ingredients as Ingredient[] | null) ?? null,
			steps: (recipe.steps as string[] | null) ?? null,
			rating: recipe.rating ? Number(recipe.rating) : null,
			createdAt: recipe.createdAt.toISOString(),
			updatedAt: recipe.updatedAt.toISOString(),
		};
	},

	update: async (id: string, userId: string, data: UpdateCustomRecipeInput) => {
		const existing = await prisma.customRecipe.findFirst({
			where: { id, userId },
		});
		if (!existing) return null;

		const recipe = await prisma.customRecipe.update({
			where: { id },
			data: {
				...(data.name !== undefined && { name: data.name }),
				...(data.type !== undefined && { type: data.type }),
				...(data.cuisine !== undefined && { cuisine: data.cuisine }),
				...(data.difficulty !== undefined && { difficulty: data.difficulty }),
				...(data.prepTime !== undefined && { prepTime: data.prepTime }),
				...(data.cookTime !== undefined && { cookTime: data.cookTime }),
				...(data.servings !== undefined && { servings: data.servings }),
				...(data.image !== undefined && { image: data.image }),
				...(data.ingredients !== undefined && {
					ingredients: data.ingredients,
				}),
				...(data.steps !== undefined && { steps: data.steps }),
			},
		});
		return {
			...recipe,
			ingredients: (recipe.ingredients as Ingredient[] | null) ?? null,
			steps: (recipe.steps as string[] | null) ?? null,
			rating: recipe.rating ? Number(recipe.rating) : null,
			createdAt: recipe.createdAt.toISOString(),
			updatedAt: recipe.updatedAt.toISOString(),
		};
	},

	delete: async (id: string, userId: string) => {
		const existing = await prisma.customRecipe.findFirst({
			where: { id, userId },
		});
		if (!existing) return false;

		await prisma.customRecipe.delete({
			where: { id },
		});
		return true;
	},
};
