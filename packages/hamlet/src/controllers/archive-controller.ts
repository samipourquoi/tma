import { Archive } from "../models/archive-model";
import { User } from "../models/user-model";
import * as fs from "fs";
import * as multer from "multer";
import { Op, WhereOptions } from "sequelize";
import { Like } from "../models/like-model";
import { Middleware, Parser, Response, Route, route } from "typera-express";
import * as t from "io-ts"
import { ArchiveAttributes } from "@tma/api/attributes";
import { authed } from "../middlewares";
import { ApiResponse } from "@tma/api";
import { ApiRoute } from "./controllers";

export module ArchiveController {
  export const getArchives: ApiRoute<"/archive"> = route
    .get("/")
    .use(Parser.query(t.partial({
      page: t.string,
      version: t.string,
      tags: t.string
    })))
    .handler(async request => {
      const { page = "1", version = "any", tags = "" } = request.query;
      const where: WhereOptions<ArchiveAttributes> = {};
      if (version != "any")
        where.versions = { [Op.contains]: String(version) }
      if (tags)
        where.tags = { [Op.contains]: tags.split(",") }
      const archives = await Archive.findAll({
        limit: 30,
        offset: (+page-1) * 30,
        include: [
          { model: User, attributes: [ "name" ] },
          Like
        ],
        where
      });

      return Response.ok({
        archives,
        total: Math.ceil(await Archive.count({ where }) / 22)
      });
    });
  
  export const getArchive: ApiRoute<"/archive/:id"> = route
    .get("/:id(int)")
    .handler(async request => {
      const { id } = request.routeParams;
      const archive = await Archive.findOne({
        where: { id },
        include: [
          { model: User, attributes: [ "name" ] },
          Like
        ]
      });

      return archive ?
        Response.ok(archive) :
        Response.notFound();
    });
  
  export const createArchive: ApiRoute<"/archive/:id", "POST"> = route
    .post("/:id(int)")
    .use(authed)
    .use(Middleware.wrapNative<{ files: Express.Multer.File[] }>(
      multer({ dest: "../../tmp" }).array("fields", 20)))
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

      const path = `../../store/${ archive.id }`;
      fs.mkdirSync(path);
      fs.writeFileSync(`${ path }/readme.md`, request.body["readme.md"]);

      (request.files as Express.Multer.File[])
        .forEach(file => fs.copyFileSync(file.path, `${ path }/${ file.originalname }`));

      return Response.created(archive);
    });
  
  export const getFiles: ApiRoute<"/archive/:id/store"> = route
    .get("/:id(int)/store")
    .handler(async request => {
      const path = `../../store/${ request.routeParams.id }`;
      const files = fs.readdirSync(path);
      const isDir = (file: string) => fs.lstatSync(`${ path }/${ file }`).isDirectory();
      return Response.ok(files.map(file => `${ file }${ isDir(file) ? "/" : "" }`))
    });

  export const getFile: ApiRoute<"/archive/:id/store/:path"> = route
    .get("/:id(int)/store/:path")
    .handler(async request => {
      try {
        const { id, path } = request.routeParams;
        const content = fs.readFileSync(`../../store/${id}/${path}`);
        return Response.ok(String(content));
      } catch (e) {
        return Response.notFound();
      }
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
