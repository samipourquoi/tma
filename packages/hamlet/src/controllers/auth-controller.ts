import { NextFunction, Request, Response } from "express";

export module AuthController {
	export function authed(req: Request, res: Response, next: NextFunction) {
		if (req.isAuthenticated())
			return next();
		res.status(401).end();
	}

	export function onDiscordCallback(req: Request, res: Response) {
		res.redirect("/");
	}
}
