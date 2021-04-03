import { NextFunction, Request, Response } from "express";
import { Archive, ArchiveAttributes } from "../models/archive-model";
import { User } from "../models/user-model";
import { GET_ArchiveFilesResult, GET_ArchivesQuery, GET_ArchivesResult, POST } from "../../api";
import * as fs from "fs";
import * as express from "express";
import { Multer } from "multer";
import * as multer from "multer";
import { isString } from "util";
import { Op, WhereOptions } from "sequelize";

export module ArchiveController {
	export async function index(req: Request, res: Response) {
		const { page = 0, version = "any", tags } = req.query as GET_ArchivesQuery;

		try {
		  const where: WhereOptions<ArchiveAttributes> = {
        ...(version != "any" ? {
          version: String(version)
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

	export async function createArchive(req: Request, res: Response, next: NextFunction) {
		const { title, readme, version, tags = "" } = req.body as Partial<POST.Archive>;
		console.log(req.body);
		if (typeof title   != "string" ||
			typeof readme  != "string" ||
			typeof version != "string" ||
			typeof tags    != "string") return res.status(400).redirect("/submit");

		const { id } = await Archive.create({
			title,
			tags: tags.split(","),
			version,
			authorID: req.user?.id || 4
		});

		const files = req.files as Express.Multer.File[];

		fs.mkdirSync(`../../store/${id}`)
		files.forEach(file => {
			fs.renameSync(
				file.path,
				`../../store/${id}/${file.originalname}`
			);
		});
		fs.writeFileSync(`../../store/${id}/README.md`, readme, { encoding: "utf-8" });

		res.redirect("/");
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
