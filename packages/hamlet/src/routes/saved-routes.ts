import { router } from "typera-express";
import { SavedController } from "../controllers/saved-controller";

export default router(SavedController.getSaved)
  .handler();
