import prisma from "../../src/lib/prisma";

export const recipeService = {
	// Récupérer toutes les recettes perso
	getAll: async () => {
		return await prisma.customRecipe.findMany();
	},

	// Créer une recette
	create: async (data: unknown) => {
		return await prisma.customRecipe.create({
			data: data as Parameters<typeof prisma.customRecipe.create>[0]["data"],
		});
	},

	getById: async (_id: string) => {
		// TODO: Implémenter la récupération par ID
	},
};
