import * as express from "express";
import * as bodyparser from "body-parser";
import archiveRoutes from "./archive-routes";
import authRoutes from "./auth-routes";
import ftpRoutes from "./ftp-routes";

export const routes = express.Router()
	.use(bodyparser.json())
	.use(bodyparser.urlencoded({ extended: true }))
	.use("/archive", archiveRoutes)
	.use("/auth", authRoutes)
	.use("/ftp", ftpRoutes);
