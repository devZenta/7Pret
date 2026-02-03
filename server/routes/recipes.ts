import { Hono } from "hono";
import { recipeController } from "../controllers/recipeController.ts";

const recipesApp = new Hono();

recipesApp.get("/", recipeController.getRecipes);
recipesApp.post("/", recipeController.createRecipe);

// recipesApp.get('/:id', recipeController.getOne)

export default recipesApp;
