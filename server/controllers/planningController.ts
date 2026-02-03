import type { Context } from "hono";
import { planningService } from "../services/planningService";

export const planningController = {
	getMyPlanning: async (c: Context) => {
		try {
			// TODO: Récupérer le vrai userId depuis la session Better Auth (c.get('user'))
			const userId = "user-id-temporaire";
			const plan = await planningService.getUserPlanning(userId);
			return c.json(plan);
		} catch (_e) {
			return c.json({ error: "Erreur récupération planning" }, 500);
		}
	},

	addToPlanning: async (c: Context) => {
		try {
			const body = await c.req.json();
			// TODO: Ajouter Validator Zod ici
			const userId = "user-id-temporaire";

			const newMeal = await planningService.addMeal(userId, body);
			return c.json(newMeal, 201);
		} catch (_e) {
			return c.json({ error: "Impossible d'ajouter au planning" }, 500);
		}
	},
};
