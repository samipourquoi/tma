import { User } from "../models/user-model";
import { FtpUser } from "../models/ftp-user-model";
import { PUT } from "../../api";
import * as bcrypt from "bcrypt";
import { Parser, Response, route, Route } from "typera-express";
import * as t from "io-ts";
import { authed } from "../middlewares";
import { ApiResponse } from "@tma/api";

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

	export const updatePassword: Route<ApiResponse<"/ftp/password", "PUT">> = route
    .put("/password")
    .use(authed)
    .use(Parser.body(t.type({
      password: t.string
    })))
    .handler(async request => {
      const { password } = request.body;
      const hashed = await bcrypt.hash(password, 12);
      await FtpUser.upsert({ password: hashed, userID: request.user.id })
      return Response.ok();
    });
}
