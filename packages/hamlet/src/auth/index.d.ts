import { User as UserModel } from "../models/user-model";

// Just so that `req.user` is statically typed.
declare global {
	module Express {
		interface User extends UserModel {}
	}
}
