import { Router } from "express";
import { authenticate } from "passport";
import { AuthController } from "../controllers/auth-controller";
import RestypedRouter from "restyped-express-async";
import authed = AuthController.authed;
import { API } from "@tma/api";
import { Route, Response, route, router } from "typera-express";
import { User } from "../models/user-model";

export default router(AuthController.getUser, AuthController.disconnect)
  .handler()
  // I don't know how to make these work with the typera router
  .get("/discord", authenticate("discord", { scope: [ "identify", "email" ] }))
  .get("/discord/callback",
    authenticate("discord", { failureRedirect: "/" }),
    (req, res) => res.redirect("/"))
