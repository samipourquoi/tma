import { Router } from "express";
import { ArchiveController } from "../controllers/archive-controller";
import * as express from "express";
import * as serveIndex from "serve-index";
import { AuthController } from "../controllers/auth-controller";
import authed = AuthController.authed;

export default Router({ strict: true })
	.get("/", ArchiveController.index)
	.post("/", authed, ArchiveController.createArchive)
	.get("/:id", ArchiveController.getArchive)
	.patch("/:id", ArchiveController.updateArchive)
	.delete("/:id", ArchiveController.deleteArchive)
	.get("/store/*", ArchiveController.getFile, ArchiveController.getFiles)
