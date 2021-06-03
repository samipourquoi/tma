import { Response, route } from "typera-express";
import { authed } from "../middlewares";
import { ApiRoute } from "./controllers";

export module AuthController {
  export const getUser: ApiRoute<"/auth/user"> = route
    .get("/user")
    .use(authed)
    .handler(async request =>
      Response.ok(request.user));

  export const disconnect: ApiRoute<"/auth/disconnect"> = route
    .get("/disconnect")
    .use(authed)
    .handler(async request => {
      request.req.logout();
      return Response.resetContent();
    });
}
