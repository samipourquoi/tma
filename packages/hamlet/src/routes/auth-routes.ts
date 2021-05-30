import { authenticate } from "passport";
import { AuthController } from "../controllers/auth-controller";
import { router } from "typera-express";

export default router(AuthController.getUser, AuthController.disconnect)
  .handler()
  // I don't know how to make these work with the typera router
  .get("/discord", authenticate("discord", { scope: [ "identify", "email" ] }))
  .get("/discord/callback",
    authenticate("discord", { failureRedirect: "/" }),
    (req, res) => res.redirect("/"))
