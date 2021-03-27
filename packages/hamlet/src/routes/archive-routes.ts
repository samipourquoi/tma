import { Router } from "express";
import { ArchiveController } from "../controllers/archive-controller";
import * as express from "express";
import * as serveIndex from "serve-index";

export default Router({ strict: true })
	.get("/", ArchiveController.index)
	.get("/:id", ArchiveController.getArchive)
	.post("/:id", ArchiveController.createArchive)
	.patch("/:id", ArchiveController.updateArchive)
	.delete("/:id", ArchiveController.deleteArchive)
	.get("/store/*", ArchiveController.getFile, ArchiveController.getFiles)
