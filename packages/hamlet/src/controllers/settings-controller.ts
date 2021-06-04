import { ApiRoute } from "./controllers";
import { Response, route } from "typera-express";
import { authed } from "../middlewares";

export module SettingsController {
  export const getSettings: ApiRoute<"/settings"> = route
    .get("/")
    .use(authed)
    .handler(async request => {
      return Response.ok();
    });
}
