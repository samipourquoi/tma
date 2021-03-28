import { User } from "../models/user-model";
import { FtpUser } from "../models/ftp-user";

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
}
