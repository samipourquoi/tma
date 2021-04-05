import { NextFunction, Request, Response } from "express";
import { Archive, ArchiveAttributes } from "../models/archive-model";
import { User } from "../models/user-model";
import { GET_ArchiveFilesResult, GET_ArchivesQuery, GET_ArchivesResult, Hierarchy, POST } from "../../api";
import * as fs from "fs";
import * as express from "express";
import { Multer } from "multer";
import * as multer from "multer";
import { isString } from "util";
import { Op, WhereOptions } from "sequelize";
import { redis } from "../index";

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
				limit: 22,
				offset: page * 22,
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
		const { title, readme, versions, tags, files } = req.body as Partial<POST.Archive>;

    if (typeof title  != "string" ||
			typeof readme   != "string" ||
			typeof versions != "string" ||
			typeof tags     != "string" ||
      typeof files    != "object") return res.status(400).redirect("/submit");

    const cacheKey = `archive:cd:${req.user!.id}`;

    if (await redis.exists(cacheKey))
      return res.status(429).end();

		const { id } = await Archive.create({
			title,
			tags:     tags == ""     ? [] : tags.split(","),
			versions: versions == "" ? [] : versions.split(","),
			authorID: req.user?.id || 4
		});

		const path = `../../store/${id}`;
		fs.mkdirSync(path);

		const writeFilesFromHierarchy = (path: string, files: Hierarchy<string>) => {
		  for (const [name, data] of Object.entries(files)) {
		    const filePath = `${path}/${name}`;

		    if (typeof data == "string")
          fs.writeFileSync(filePath, Buffer.from(data, "base64"));
		    else
		      writeFilesFromHierarchy(filePath, data);
      }
    }
    writeFilesFromHierarchy(path, files);

		fs.writeFileSync(`../../store/${id}/README.md`, readme, { encoding: "utf-8" });

		await redis.set(cacheKey, "gay sex", "EX", 30 /* seconds */);

		res.status(401).end();
	}

	export function updateArchive(req: Request, res: Response) {
		res.end();
	}

	export function deleteArchive(req: Request, res: Response) {
		res.end();
	}

	export function getFiles(req: Request, res: Response) {
		const path = `../..${req.url}`;

		fs.readdir(path, (err, files) => {
			if (err) {
				res.status(404).end();
				return;
			}

			const isDir = (file: string) => fs.lstatSync(`${path}/${file}`).isDirectory();
			res.send(files.map(file => `${file}${isDir(file) ? "/" : ""}`) as GET_ArchiveFilesResult);
		});
	}

	export function getFile(req: Request, res: Response, next: NextFunction) {
		express.static("../..", { redirect: false })(req, res, next);
	}
}
