import prisma from "../../src/lib/prisma";

export const planningService = {
	getUserPlanning: async (userId: string) => {
		return await prisma.mealPlanning.findMany({
			where: { userId },
			orderBy: { date: "asc" },
			include: {},
		});
	},

	// Ajouter un repas au planning
	addMeal: async (
		userId: string,
		data: { date: string; slot: string; recipeId: string; source: string },
	) => {
		return await prisma.mealPlanning.create({
			data: {
				userId,
				date: new Date(data.date),
				slot: data.slot,
				recipeId: data.recipeId,
				source: data.source,
			},
		});
	},

	removeMeal: async (_id: string) => {
		// TODO: prisma.mealPlanning.delete(...)
	},
};
