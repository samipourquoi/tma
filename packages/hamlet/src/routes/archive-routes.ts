import { Router } from "express";
import { ArchiveController } from "../controllers/archive-controller";

export default Router()
	.get("/", ArchiveController.index)
	.get("/:id", ArchiveController.getArchive)
	.post("/:id", ArchiveController.createArchive)
	.patch("/:id", ArchiveController.updateArchive)
	.delete("/:id", ArchiveController.deleteArchive);
