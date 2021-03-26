import { NextFunction, Request, Response } from "express";
import { Archive } from "../models/archive-model";
import { User } from "../models/user-model";
import { GET_ArchivesQuery, GET_ArchivesResult } from "../../api";

export module ArchiveController {
	export async function index(req: Request, res: Response) {
		const { page = 0 } = req.query as GET_ArchivesQuery;

		try {
			const archives = await Archive.findAll({
				limit: 22,
				offset: page * 22,
				include: User
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
		const archive = await Archive.findOne({
			where: {
				id: req.params.id
			},
			include: User
		});

		if (archive) {
			res.send(archive.toJSON());
		} else {
			res.status(404)
				.end();
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
}
