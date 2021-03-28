import { Request, Response } from "express";

export module RootController {
	export function index(req: Request, res: Response) {
		console.log("root:", req.sessionID);
		res.send("hello world!");
	}
}
