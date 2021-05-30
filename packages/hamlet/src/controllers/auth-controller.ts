// import { NextFunction, Request, Response } from "express";
import { Response, route, Route } from "typera-express";
import { User } from "../models/user-model";
import { authed } from "../middlewares";

export module AuthController {
  export const getUser: Route<
    Response.Ok<User> | Response.Unauthorized
  > = route
    .get("/user")
    .use(authed)
    .handler(async request =>
      Response.ok(request.user));

  export const disconnect: Route<
    Response.ResetContent | Response.Unauthorized
  > = route
    .get("/disconnect")
    .use(authed)
    .handler(async request => {
      request.req.logout();
      return Response.resetContent();
    });
}
