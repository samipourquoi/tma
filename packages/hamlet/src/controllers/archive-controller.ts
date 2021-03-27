import { NextFunction, Request, Response } from "express";
import { Archive } from "../models/archive-model";
import { User } from "../models/user-model";
import { GET_ArchiveFilesResult, GET_ArchivesQuery, GET_ArchivesResult } from "../../api";
import * as fs from "fs";
import * as express from "express";

export module ArchiveController {
	export async function index(req: Request, res: Response) {
		const { page = 0 } = req.query as GET_ArchivesQuery;

		try {
			const archives = await Archive.findAll({
				limit: 22,
				offset: page * 22,
				include: {
					model: User,
					attributes: ["name"]
				}
			});

			res.send({
				archives,
				amount: Math.ceil(await Archive.count() / 22)
			} as GET_ArchivesResult);
		} catch {
			res.status(400)
				.end();
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

	export function createArchive(req: Request, res: Response) {
		res.end();
	}

	export function updateArchive(req: Request, res: Response) {
		res.end();
	}

	export function deleteArchive(req: Request, res: Response) {
		res.end();
	}

	export function getFiles(req: Request, res: Response) {
		fs.readdir(`../..${req.url}`, (err, files) => {
			if (err)
				res.status(404).end()
			else
				res.send(files as GET_ArchiveFilesResult);
		});
	}

	export function getFile(req: Request, res: Response, next: NextFunction) {
		express.static("../..")(req, res, next);
	}
}
