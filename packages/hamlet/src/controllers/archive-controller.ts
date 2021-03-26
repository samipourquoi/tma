import { Request, Response } from "express";
import { GET_ArchiveEntryInfo } from "../../api";

export module ArchiveController {
	export function index(req: Request, res: Response) {
		res.send([
			{
				title: "birch farm",
				author: "samipourquoi",
				date: new Date(1616710063557),
				version: "1.16.2",
				tags: ["redstone"],
				id: 1
			},
		] as GET_ArchiveEntryInfo[]);
	}

	export function getPost(req: Request, res: Response) {
		res.end();
	}

	export function createPost(req: Request, res: Response) {
		res.end();
	}

	export function updatePost(req: Request, res: Response) {
		res.end();
	}

	export function deletePost(req: Request, res: Response) {
		res.end();
	}
}
