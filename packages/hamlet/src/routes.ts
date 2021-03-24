import { Router } from "express";
import { RootController } from "./controllers/root-controller";

export const routes = Router()
	.get("/", RootController.index);
