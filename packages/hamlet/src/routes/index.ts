import { Router } from "express";
import { RootController } from "../controllers/root-controller";
import archiveRoutes from "./archive-routes";

export const routes = Router()
	.get("/", RootController.index)
	.use("/archive", archiveRoutes);
