import { Request, Response } from "express";

export module RootController {
	export function index(req: Request, res: Response) {
		res.send("hello world!");
	}
}
