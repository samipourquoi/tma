import { User } from "../models/user-model";
import { FtpUser } from "../models/ftp-user";
import { Request, Response } from "express";
import { PUT } from "../../api";
import * as bcrypt from "bcrypt";

export module FtpController {
	export async function getFtpUser(email: string, password: string):
		Promise<FtpUser | null>
	{
		const ftpUser = await FtpUser.findOne({
			include: {
				model: User,
				where: { email }
			}
		});

		return ftpUser && await bcrypt.compare(password, ftpUser.password) ?
			ftpUser :
			null;
	}

	export async function newPassword(req: Request, res: Response) {
		const { password } = req.body as Partial<PUT.Ftp.Password>;
		if (!password)
			return res.status(400).end();
		const hashed = await bcrypt.hash(password, 12);

		await FtpUser.upsert({ password: hashed, userID: req.user!.id })
	}
}
