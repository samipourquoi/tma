import { Router } from "express";
import { ArchiveController } from "../controllers/archive-controller";

export default Router()
	.get("/", ArchiveController.index)
	.get("/:id", ArchiveController.getPost)
	.post("/:id", ArchiveController.createPost)
	.patch("/:id", ArchiveController.updatePost)
	.delete("/:id", ArchiveController.deletePost);
