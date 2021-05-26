import { Router } from "express";
import { ArchiveController } from "../controllers/archive-controller";
import * as express from "express";
import * as serveIndex from "serve-index";
import { AuthController } from "../controllers/auth-controller";
import authed = AuthController.authed;
import * as multer from "multer";

const upload = multer({ dest: "../../tmp" })

export default Router({ strict: true })
	.get("/", ArchiveController.index)
	.post("/", authed,
    upload.array("files", 20),
    ArchiveController.createArchive)
	.get("/:id", ArchiveController.getArchive)
	.patch("/:id", ArchiveController.updateArchive)
	.delete("/:id", ArchiveController.deleteArchive)
  .get("/:id/store", ArchiveController.getFiles)
	.get("/:id/store/:path", ArchiveController.getFile)
