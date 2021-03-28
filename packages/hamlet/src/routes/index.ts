import * as express from "express";
import * as bodyparser from "body-parser";
import { RootController } from "../controllers/root-controller";
import archiveRoutes from "./archive-routes";
import authRoutes from "./auth-routes";
import ftpRoutes from "./ftp-routes";

export const routes = express.Router()
	.use(bodyparser.json())
	.use(bodyparser.urlencoded({ extended: true }))
	.get("/", RootController.index)
	.use("/archive", archiveRoutes)
	.use("/auth", authRoutes)
	.use("/ftp", ftpRoutes);
