// import { NextFunction, Request, Response } from "express";
import { GET } from "../../api";
import { Middleware, Response, route, Route } from "typera-express";
import { User } from "../models/user-model";

export module AuthController {
  export const authed: Middleware.Middleware<
    { user: User },
    Response.Unauthorized
  > = async ({ req }) =>
    req.isAuthenticated() ?
      Middleware.next({ user: req.user }) :
      Middleware.stop(Response.unauthorized());

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
