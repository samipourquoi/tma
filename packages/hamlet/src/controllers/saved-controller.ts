import { ApiRoute } from "./controllers";
import { Parser, Response, route } from "typera-express";
import { authed } from "../middlewares";
import * as t from "io-ts";
import { Op, WhereOptions } from "sequelize";
import { Archive } from "../models/archive-model";
import { User } from "../models/user-model";
import { Like } from "../models/like-model";
import { LikeAttributes } from "@tma/api/attributes";
import { NumberFromString } from "io-ts-types/lib/NumberFromString";

export module SavedController {
  export const getSaved: ApiRoute<"/saved"> = route
    .get("/")
    .use(authed)
    .use(Parser.query(t.type({
      page: NumberFromString
    })))
    .handler(async request => {
      const { page } = request.query;

      const where: WhereOptions<LikeAttributes> = {
        userID: request.user.id
      }

      const archives = await Like.findAll({
        limit: 30,
        offset: (+page - 1) * 30,
        include: [
          {
            model: Archive,
            include: [
              {
                model: User,
                attributes: ["name"]
              }
            ]
          }
        ],
        where
      }).then(likes => likes.map(like => like.archive));

      return Response.ok({
        archives,
        total: Math.ceil(await Like.count({ where }) / 30)
      });
    });
}
