import { Router } from "express";
import * as bodyparser from "body-parser";
import { RootController } from "../controllers/root-controller";
import archiveRoutes from "./archive-routes";

export const routes = Router()
	.use(bodyparser.json())
	.get("/", RootController.index)
	.use("/archive", archiveRoutes);
