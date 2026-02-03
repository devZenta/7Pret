import { Hono } from "hono";
import { planningController } from "../controllers/planningController";

const planningApp = new Hono();

planningApp.get("/", planningController.getMyPlanning);
planningApp.post("/", planningController.addToPlanning);

export default planningApp;
