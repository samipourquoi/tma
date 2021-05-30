import { Middleware, Response } from "typera-express";
import { User } from "./models/user-model";

export const authed: Middleware.Middleware<
  { user: User },
  Response.Unauthorized
  > = async ({ req }) =>
  req.isAuthenticated() ?
    Middleware.next({ user: req.user }) :
    Middleware.stop(Response.unauthorized());
