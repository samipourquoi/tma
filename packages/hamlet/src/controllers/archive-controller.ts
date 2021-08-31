import { ArchiveBase, Archive } from "../models/archive-model";
import { User } from "../models/user-model";
import * as fs from "fs";
import { Op, WhereOptions } from "sequelize";
import { Like } from "../models/like-model";
import { Middleware, Parser, Response, route } from "typera-express";
import * as t from "io-ts"
import { ArchiveAttributes, FullArchiveAttributes } from "@tma/api/attributes";
import { authed, ownsArchive } from "../middlewares";
import { ApiRoute } from "./controllers";
import { NumberFromString } from "io-ts-types/lib/NumberFromString";
import { SearchSystem } from "../search-system";
import simpleGit from "simple-git";
import * as multer from "multer";

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
      const ids = search ? SearchSystem.search(search) : void 0;
      const where: WhereOptions<ArchiveAttributes> = {};
      if (version != "any")
        where.versions = { [Op.contains]: String(version) };
      if (tags)
        where.tags = { [Op.contains]: tags.split(",") };
      if (ids)
        where.id = { [Op.in]: ids };

      const bases = await ArchiveBase.findAll({
        limit: 30,
        offset: (+page - 1) * 30,
        where,
        include: {
          model: Archive,
          include: [
            { model: User, attributes: ["name"] },
            Like,
            ArchiveBase
          ]
        }
      });

      const archives = await Promise.all(
        bases.map(base =>
          base.archives.find(async archive =>
            archive.commit == await base.getLatestCommit()
          )
        )
      ).then(archives => archives.filter(archive => archive) as Archive[]);

      return Response.ok({
        archives,
        total: Math.ceil(await Archive.count({ where }) / 30)
      });
    });

  export const getArchive: ApiRoute<"/archive/:id"> = route
    .get("/:id(int)")
    .use(Parser.query(t.partial({
      commit: t.string
    })))
    .handler(async request => {
      const { id } = request.routeParams;
      const { commit = await ArchiveBase.getLatestCommit(id) } = request.query;
      const archive = await Archive.findOne({
        where: {
          commit,
          baseID: id
        },
        include: [
          { model: User, attributes: ["name"] },
          Like,
          { model: ArchiveBase }
        ]
      });

      return archive ?
        Response.ok(archive) :
        Response.notFound();
    });

  export const getArchiveCommits: ApiRoute<"/archive/:id/commits"> = route
    .get("/:id(int)/commits")
    .handler(async request => {
      const { id } = request.routeParams;
      try {
        const git = simpleGit(`../../store/${id}`);
        const logs = await git.log();
        const formatted = logs.all.map(({ hash, date }) => ({ hash: hash.slice(0, 7), date }));
        return Response.ok(formatted);
      } catch (e) {
        return Response.notFound();
      }
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
      await git.addConfig("user.email", "auto@tmc-archive.org");
      await git.addConfig("user.name", "auto");
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

  export const getFiles: ApiRoute<"/archive/:id/store"> = route
    .get("/:id(int)/store")
    .use(Parser.query(t.type({
      path: t.string,
      commit: t.union([t.string, t.undefined])
    })))
    .handler(async request => {
      const { id } = request.routeParams;
      const { path, commit = "HEAD" } = request.query;
      try {
        const git = simpleGit(`../../store/${id}`);
        const result = await git.show(`${commit}:${path}`);

        // Directories output always start with that line.
        return Response.ok(
          result.startsWith(`tree ${commit}:\n`) ?
            result.split("\n").slice(2, -1).filter(file => !["readme.json", "tags.json"].includes(file)) :
            result
        );
      } catch (e) {
        return Response.notFound();
      }
    });

  const upload = multer({ dest: `../../tmp` });
  export const createFiles: ApiRoute<"/archive/:id/store", "POST"> = route
    .post("/:id(int)/store")
    .use(authed)
    .use(ownsArchive)
    .use(Middleware.wrapNative(
      upload.array("files"),
      request => ({ files: request.req.files as Express.Multer.File[] })
    ))
    .handler(async request => {
      const { id } = request.routeParams;
      for (const file of request.files) {
        if ([".git", "readme.json"].includes(file.originalname))
          continue;
        fs.renameSync(file.path, `../../store/${id}/${file.originalname}`);
      }
      const archive = await Archive.findOne({
        where: {
          baseID: id
        }
      });
      await archive!.commitFiles(`upload files: ${request.files.map(f => f.originalname).join(", ")}`);
      return Response.created();
    });

  export const deleteFiles: ApiRoute<"/archive/:id/store", "DELETE"> = route
    .delete("/:id(int)/store")
    .use(authed)
    .use(ownsArchive)
    .use(Parser.body(t.type({
      paths: t.array(t.string)
    })))
    .handler(async request => {
      const { id } = request.routeParams;
      for (const path of request.body.paths) {
        if ([".git", "readme.json"].includes(path))
          continue;
        fs.unlinkSync(`../../store/${id}/${path}`);
      }
      const archive = await Archive.findOne({
        where: {
          baseID: id
        }
      });
      await archive!.commitFiles(`delete files: ${request.body.paths.join(", ")}`);
      return Response.ok();
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
