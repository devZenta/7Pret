import type { Context } from "hono";
import { recipeService } from "../services/recipeService";

export const recipeController = {
	getRecipes: async (c: Context) => {
		try {
			const recipes = await recipeService.getAll();
			return c.json(recipes);
		} catch (_e) {
			return c.json({ error: "Impossible de récupérer les recettes" }, 500);
		}
	},

	createRecipe: async (c: Context) => {
		try {
			const body = await c.req.json();
			// TODO: Ajouter la validation (Validator) ici avant d'appeler le service
			const newRecipe = await recipeService.create(body);
			return c.json(newRecipe, 201);
		} catch (_e) {
			return c.json({ error: "Erreur lors de la création" }, 500);
		}
	},
};
