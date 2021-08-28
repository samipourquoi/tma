import { ArchiveBase, Archive } from "../models/archive-model";
import { User } from "../models/user-model";
import * as fs from "fs";
import * as multer from "multer";
import { Op, WhereOptions } from "sequelize";
import { Like } from "../models/like-model";
import { Middleware, Parser, Response, route } from "typera-express";
import * as t from "io-ts"
import { ArchiveAttributes, FullArchiveAttributes } from "@tma/api/attributes";
import { authed } from "../middlewares";
import { ApiRoute } from "./controllers";
import { NumberFromString } from "io-ts-types/lib/NumberFromString";
import { nonEmptyArray } from "io-ts-types/lib/nonEmptyArray";
import { SearchSystem } from "../search-system";
import simpleGit from "simple-git";

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
            Like,
            ArchiveBase
          ],
          where
        }).then(archives => ids
          .map(id => archives.find(archive => archive.base.id == id)!)
          .slice((+page - 1) * 30, +page * 30));
      } else {
        archives = await Archive.findAll({
          limit: 30,
          offset: (+page - 1) * 30,
          include: [
            { model: User, attributes: ["name"] },
            Like,
            ArchiveBase
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
        include: [
          { model: User, attributes: ["name"] },
          Like,
          { model: ArchiveBase, where: { id } }
        ]
      });

      return archive ?
        Response.ok(archive) :
        Response.notFound();
    });


  export const createArchive: ApiRoute<"/archive", "POST"> = route
    .post("/")
    .use(authed)
    .use(Parser.body(t.type({
      title: t.string,
      readme: t.UnknownRecord,
      tags: t.array(t.string)
    })))
    .handler(async request => {
      const { title, readme, tags } = request.body;

      const base = await ArchiveBase.create();

      const path = `../../store/${base.id}`;
      fs.mkdirSync(path);
      const git = simpleGit(path);
      await git.init();
      fs.writeFileSync(`${path}/readme.json`, JSON.stringify(readme));
      fs.writeFileSync(`${path}/tags.json`, JSON.stringify(tags));
      await git.add(".");
      const { commit } = await git.commit("initial commit");

      const archive = await Archive.create({
        title,
        tags,
        versions: [],
        authorID: request.user.id,
        commit,
        baseID: base.id
      }, { include: ArchiveBase });

      return Response.created(archive);
    });

  export const getFile: ApiRoute<"/archive/:id/store"> = route
    .get("/:id(int)/store")
    .use(Parser.query(t.type({
      path: t.string
    })))
    .handler(async request => {
      const path = `../../store/${request.routeParams.id}/${request.query.path}`;
      const isDir = fs.lstatSync(path).isDirectory();
      if (!fs.existsSync(path))
        return Response.notFound();
      return Response.ok(isDir ?
        fs.readdirSync(path).filter(f => ![".git", "readme.json", "tags.json"].includes(f)) :
        fs.readFileSync(path).toString())
    });

  export const like: ApiRoute<"/archive/:id/like", "POST"> = route
    .post("/:id(int)/like")
    .use(authed)
    .handler(async request => {
      const { id: baseID } = request.routeParams;
      const { id } = await Archive.findOne({
        where: {
          commit: await ArchiveBase.getLatestCommit(baseID)
        }
      }) ?? {};

      if (!id)
        return Response.badRequest();

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
        include: [
          { model: User, attributes: ["name"] },
          Like,
          { model: ArchiveBase }
        ]
      }) as FullArchiveAttributes);
    });
}
