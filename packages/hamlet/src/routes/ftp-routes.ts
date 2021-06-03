import { router } from "typera-express";
import { FtpController } from "../controllers/ftp-controller";

export default router(FtpController.updatePassword)
  .handler();
