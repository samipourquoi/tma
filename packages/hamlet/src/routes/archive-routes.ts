import { ArchiveController } from "../controllers/archive-controller";
import { router } from "typera-express";

export default router(
  ArchiveController.getArchives,
  ArchiveController.getArchive,
  ArchiveController.createArchive,
  ArchiveController.getFiles,
  ArchiveController.like)
  .handler()
  .get("/:id/store/*", (req, res, next) => {
    const id = +req.params.id;
    const path = req.url.split("/")
      .slice(3)
      .join();
    res.download(`${__dirname}/../../../../store/${id}/${path}`);
  });
