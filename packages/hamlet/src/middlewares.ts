import { Middleware, RequestBase, Response } from "typera-express";
import { User } from "./models/user-model";
import { Archive } from "./models/archive-model";

export const authed: Middleware.Middleware<{ user: User },
  Response.Unauthorized> = async ({ req }) =>
  req.isAuthenticated() ?
    Middleware.next({ user: req.user }) :
    Middleware.stop(Response.unauthorized());


export const ownsArchive = async (
  request: RequestBase & {
    user: User,
    routeParams: { id: number }
  }
) => {
  const archive = await Archive.findOne({
    where: {
      baseID: request.routeParams.id,
      authorID: request.user.id
    }
  });
  return archive ?
    Middleware.next() :
    Middleware.stop(Response.unauthorized());
}
