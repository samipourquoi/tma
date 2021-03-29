import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import authed = AuthController.authed;
import { FtpController } from "../controllers/ftp-controller";

export default Router()
	.put("/password", authed, FtpController.newPassword)
