import { Response, route, Route } from "typera-express";
import { User } from "../models/user-model";
import { authed } from "../middlewares";
import { ApiResponse } from "@tma/api";

export module AuthController {
  export const getUser: Route<ApiResponse<"/auth/user">> = route
    .get("/user")
    .use(authed)
    .handler(async request =>
      Response.ok(request.user));

  export const disconnect: Route<ApiResponse<"/auth/disconnect">> = route
    .get("/disconnect")
    .use(authed)
    .handler(async request => {
      request.req.logout();
      return Response.resetContent();
    });
}
