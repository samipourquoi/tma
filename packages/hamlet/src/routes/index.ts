import * as express from "express";
import * as bodyparser from "body-parser";
import archiveRoutes from "./archive-routes";
import savedRoutes from "./saved-routes";
import authRoutes from "./auth-routes";
import ftpRoutes from "./ftp-routes";

export const routes = express.Router()
  .use(bodyparser.json())
  .use(bodyparser.urlencoded({ extended: true }))
  .use("/archive", archiveRoutes)
  .use("/saved", savedRoutes)
  .use("/auth", authRoutes)
  .use("/ftp", ftpRoutes);
