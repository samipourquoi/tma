import { User } from "../models/user-model";
import { FtpUser } from "../models/ftp-user";
import { Request, Response } from "express";
import { PUT } from "../../api";

export module FtpController {
	export async function getFtpUser(email: string, password: string):
		Promise<FtpUser | null>
	{
		return FtpUser.findOne({
			where: { password },
			include: {
				model: User,
				where: { email }
			}
		});
	}

	export async function newPassword(req: Request, res: Response) {
		const { password } = req.body as Partial<PUT.Ftp.Password>;
		if (!password)
			return res.status(400).end();

		await FtpUser.upsert({ password, userID: req.user!.id })
	}
}
