import { Router } from "express";
import { authenticate } from "passport";
import { AuthController } from "../controllers/auth-controller";

export default Router()
	.get("/discord",
		authenticate("discord", { scope: ["identify"] }))
	.get("/discord/callback",
		authenticate("discord", { failureRedirect: "/" }),
		AuthController.onDiscordCallback);
