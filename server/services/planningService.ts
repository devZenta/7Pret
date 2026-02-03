import prisma from "../../src/lib/prisma";

type CreateMealInput = {
	date: string;
	slot?: string;
	recipeId: string;
	source: string;
};

type UpdateMealInput = {
	date?: string;
	slot?: string;
	recipeId?: string;
	source?: string;
};

const transformMeal = (
	meal: Awaited<ReturnType<typeof prisma.mealPlanning.findFirst>>,
) => {
	if (!meal) return null;
	return {
		...meal,
		date: meal.date.toISOString().split("T")[0],
		createdAt: meal.createdAt.toISOString(),
		updatedAt: meal.updatedAt.toISOString(),
	};
};

export const planningService = {
	getUserPlanning: async (userId: string) => {
		const meals = await prisma.mealPlanning.findMany({
			where: { userId },
			orderBy: { date: "asc" },
		});
		return meals.map((meal) => ({
			...meal,
			date: meal.date.toISOString().split("T")[0],
			createdAt: meal.createdAt.toISOString(),
			updatedAt: meal.updatedAt.toISOString(),
		}));
	},

	getById: async (id: string, userId: string) => {
		const meal = await prisma.mealPlanning.findFirst({
			where: { id, userId },
		});
		return transformMeal(meal);
	},

	addMeal: async (userId: string, data: CreateMealInput) => {
		const meal = await prisma.mealPlanning.create({
			data: {
				userId,
				date: new Date(data.date),
				slot: data.slot ?? "diner",
				recipeId: data.recipeId,
				source: data.source,
			},
		});
		return {
			...meal,
			date: meal.date.toISOString().split("T")[0],
			createdAt: meal.createdAt.toISOString(),
			updatedAt: meal.updatedAt.toISOString(),
		};
	},

	updateMeal: async (id: string, userId: string, data: UpdateMealInput) => {
		const existing = await prisma.mealPlanning.findFirst({
			where: { id, userId },
		});
		if (!existing) return null;

		const meal = await prisma.mealPlanning.update({
			where: { id },
			data: {
				...(data.date !== undefined && { date: new Date(data.date) }),
				...(data.slot !== undefined && { slot: data.slot }),
				...(data.recipeId !== undefined && { recipeId: data.recipeId }),
				...(data.source !== undefined && { source: data.source }),
			},
		});
		return {
			...meal,
			date: meal.date.toISOString().split("T")[0],
			createdAt: meal.createdAt.toISOString(),
			updatedAt: meal.updatedAt.toISOString(),
		};
	},

	removeMeal: async (id: string, userId: string) => {
		const existing = await prisma.mealPlanning.findFirst({
			where: { id, userId },
		});
		if (!existing) return false;

		await prisma.mealPlanning.delete({
			where: { id },
		});
		return true;
	},
};
