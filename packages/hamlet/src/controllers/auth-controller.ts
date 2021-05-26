import { NextFunction, Request, Response } from "express";
import { GET } from "../../api";

export module AuthController {
	export function authed(req: Request, res: Response, next: NextFunction) {
		if (req.isAuthenticated())
			return next();
		res.status(401).end();
	}

	export function onDiscordCallback(req: Request, res: Response) {
		res.redirect("/");
	}

	export function getUser(req: Request, res: Response) {
	  if (req.isAuthenticated()) {
	    res.send(req.user! as GET.Auth.UserRes);
	  } else {
		res.send(null as GET.Auth.UserRes);
	  }
  	}

  	export async function disconnect(req: Request, res: Response) {
		req.logout();
		res.redirect("/");
	}
}
