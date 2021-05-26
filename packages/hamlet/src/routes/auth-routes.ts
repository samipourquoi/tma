import { Router } from "express";
import { authenticate } from "passport";
import { AuthController } from "../controllers/auth-controller";
import authed = AuthController.authed;

export default Router()
  .get("/discord",
    authenticate("discord", { scope: [ "identify", "email" ] }))
  .get("/discord/callback",
    authenticate("discord", { failureRedirect: "/" }),
    AuthController.onDiscordCallback)
  .get("/user", authed, AuthController.getUser)
  .get("/disconnect", authed, AuthController.disconnect);
