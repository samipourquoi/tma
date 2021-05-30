import { ArchiveController } from "../controllers/archive-controller";
import { router } from "typera-express";

export default router(
  ArchiveController.getArchives,
  ArchiveController.getArchive,
  ArchiveController.createArchive,
  ArchiveController.getFiles,
  ArchiveController.getFile,
  ArchiveController.like)
  .handler();
