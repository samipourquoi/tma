import { NextFunction, Request, Response } from "express";
import { Archive, ArchiveAttributes } from "../models/archive-model";
import { User } from "../models/user-model";
import {
  GET_ArchiveFilesResult,
  GET_ArchiveResult,
  GET_ArchivesQuery,
  GET_ArchivesResult,
  Hierarchy,
  POST,
  TagType
} from "../../api";
import * as fs from "fs";
import * as express from "express";
import { Multer, MulterError } from "multer";
import * as multer from "multer";
import { isString } from "util";
import { Op, WhereOptions } from "sequelize";
import { redis } from "../index";
import * as YAML from "yaml";

export module ArchiveController {
	export async function index(req: Request, res: Response) {
		const { page = 0, version = "any", tags } = req.query as GET_ArchivesQuery;

		try {
		  const where: WhereOptions<ArchiveAttributes> = {
        ...(version != "any" ? {
          versions: {
            [ Op.contains ]: String(version)
          }
        } : {}),
        ...(tags ? { tags: {
            [ Op.contains ]: tags.split(",")
          }} : {})
      };
			const archives = await Archive.findAll({
				limit: 30,
				offset: page * 30,
				include: {
					model: User,
					attributes: ["name"]
				},
				where
			});

			res.send({
				archives,
				amount: Math.ceil(await Archive.count({ where }) / 22)
			} as GET_ArchivesResult);
		} catch (e) {
			res.status(400)
				.send(e.message);
		}
	}

	export async function getArchive(req: Request, res: Response) {
		try {
			const archive = await Archive.findOne({
				where: {
					id: req.params.id
				},
				include: {
					model: User,
					attributes: [ "name" ]
				}
			});
			if (!archive) {
				res.status(404).end();
				return;
			}

			res.send(archive.toJSON());
		} catch {
			res.status(500).end();
		}
	}

	export async function createArchive(req: Request, res: Response) {
	  interface Meta {
	    title: string,
      tags: TagType[],
      versions: string[]
    }
    function isMeta(meta: any): meta is Meta {
	    return typeof meta?.title == "string"
        && Array.isArray(meta?.tags)
        && Array.isArray(meta?.versions)
        && typeof (meta?.tags[0] ?? "") == "string"
        && typeof (meta?.versions[0] ?? "") == "string";
    }

    const { "readme.md": readme, "meta.yml": meta } = req.body;

    if (typeof readme != "string" || typeof meta != "string")
      return res.status(400).end();

    let parsedMeta: Meta;
    try {
      const parsed = YAML.parse(meta);
      if (isMeta(parsed)) {
        parsedMeta = parsed;
      } else {
        throw void 0;
      }
    } catch (e) {
      return res.status(400).end();
    }
    const { title, tags, versions } = parsedMeta;

    const archive = await Archive.create({
      title,
      tags,
      versions,
      authorID: req.user?.id
    });

    const path = `../../store/${archive.id}`;
    fs.mkdirSync(path);
    fs.writeFileSync(`${path}/readme.md`, readme);

    const uri = `/archive/${archive.id}-${encodeURI(archive.title
        .toLowerCase()
        .replace(/( )|(%20)/g, "-"))}`;

    (req.files as Express.Multer.File[])
      .forEach(file => fs.copyFileSync(file.path, `${path}/${file.originalname}`));

    res.redirect(uri);
  }

	export function updateArchive(req: Request, res: Response) {
		res.end();
	}

	export function deleteArchive(req: Request, res: Response) {
		res.end();
	}

	export function getFiles(req: Request, res: Response) {
		const path = `../../store/${req.params.id}`;

    fs.readdir(path, (err, files) => {
			if (err)
        return res.status(404).end();

			const isDir = (file: string) => fs.lstatSync(`${path}/${file}`).isDirectory();
			res.send(files.map(file => `${file}${isDir(file) ? "/" : ""}`) as GET_ArchiveFilesResult);
		});
	}

	export function getFile(req: Request, res: Response, next: NextFunction) {
    fs.readFile(`../../store/${req.params.id}/${req.params.path}`, (err, content) => {
      if (err)
        return res.status(404).end();

      res.send(content);
    });
	}
}
