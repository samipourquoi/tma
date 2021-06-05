import { Archive } from "../models/archive-model";
import { User } from "../models/user-model";
import * as fs from "fs";
import * as multer from "multer";
import { Op, WhereOptions } from "sequelize";
import { Like } from "../models/like-model";
import { Middleware, Parser, Response, route } from "typera-express";
import * as t from "io-ts"
import { ArchiveAttributes } from "@tma/api/attributes";
import { authed } from "../middlewares";
import { ApiRoute } from "./controllers";
import { NumberFromString } from "io-ts-types/lib/NumberFromString";
import { nonEmptyArray } from "io-ts-types/lib/nonEmptyArray";
import { SearchSystem } from "../search-system";

export module ArchiveController {
  export const getArchives: ApiRoute<"/archive"> = route
    .get("/")
    .use(Parser.query(t.partial({
      page: NumberFromString,
      version: t.string,
      tags: t.string,
      search: t.string
    })))
    .handler(async request => {
      const { page = 1, version = "any", tags = "", search } = request.query;

      const where: WhereOptions<ArchiveAttributes> = {};
      if (version != "any")
        where.versions = { [Op.contains]: String(version) }
      if (tags)
        where.tags = { [Op.contains]: tags.split(",") }

      let archives: Archive[];
      if (search) {
        const ids = SearchSystem.search(search);
        archives = await Archive.findAll({
          include: [
            { model: User, attributes: ["name"] },
            Like
          ],
          where
        }).then(archives => ids
          .map(id => archives.find(archive => archive.id == id)!)
          .slice((+page - 1) * 30, +page * 30));
      } else {
        archives = await Archive.findAll({
          limit: 30,
          offset: (+page - 1) * 30,
          include: [
            { model: User, attributes: ["name"] },
            Like
          ],
          where
        });
      }

      return Response.ok({
        archives,
        total: Math.ceil(await Archive.count({ where }) / 30)
      });
    });

  export const getArchive: ApiRoute<"/archive/:id"> = route
    .get("/:id(int)")
    .handler(async request => {
      const { id } = request.routeParams;
      const archive = await Archive.findOne({
        where: { id },
        include: [
          { model: User, attributes: ["name"] },
          Like
        ]
      });

      return archive ?
        Response.ok(archive) :
        Response.notFound();
    });

  export const createArchive: ApiRoute<"/archive", "POST"> = route
    .post("/")
    .use(authed)
    .use(Middleware.wrapNative<{ files?: Express.Multer.File[] }>(
      multer({ dest: "../../tmp" }).array("files", 20)))
    .use(async request => {
      if (request.req.body["meta.yml"]) {
        request.req.body["meta.yml"] = JSON.parse(request.req.body["meta.yml"]);
        return Middleware.next({});
      } else {
        return Middleware.stop(Response.badRequest("invalid meta"));
      }
    })
    .use(Parser.body(t.type({
      "readme.md": t.string,
      "meta.yml": t.type({
        title: t.string,
        tags: t.array(t.string),
        versions: t.array(t.string)
      })
    })))
    .handler(async request => {
      const { title, tags, versions } = request.body["meta.yml"];
      const archive = await Archive.create({
        title,
        tags,
        versions,
        authorID: request.user.id
      });

      const path = `../../store/${archive.id}`;
      fs.mkdirSync(path);
      fs.writeFileSync(`${path}/readme.md`, request.body["readme.md"]);
      SearchSystem.documents.addDocument(request.body["readme.md"]);

      request.files?.forEach(file => fs.copyFileSync(file.path, `${path}/${file.originalname}`));

      // return Response.created(archive);
      return Response.redirect(301, "/");
    });

  export const getFiles: ApiRoute<"/archive/:id/store"> = route
    .get("/:id(int)/store")
    .handler(async request => {
      const path = `../../store/${request.routeParams.id}`;
      const files = fs.readdirSync(path);
      const isDir = (file: string) => fs.lstatSync(`${path}/${file}`).isDirectory();
      return Response.ok(files.map(file => `${file}${isDir(file) ? "/" : ""}`))
    });

  export const like: ApiRoute<"/archive/:id/like", "POST"> = route
    .post("/:id(int)/like")
    .use(authed)
    .handler(async request => {
      const { id } = request.routeParams;

      const [, created] = await Like.findOrCreate({
        where: {
          archiveID: id,
          userID: request.user.id
        }
      });
      if (!created) {
        await Like.destroy({
          where: {
            archiveID: id,
            userID: request.user.id
          }
        });
      }

      return Response.ok(await Archive.findOne({
        where: { id },
        include: [{ model: User, attributes: ["name"] }, Like]
      }).then(arch => arch!));
    });
}
