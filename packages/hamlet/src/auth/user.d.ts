import { User as UserModel } from "../models/user-model";

// Just so that `req.user` is statically typed.
declare module Express {
	declare type User = UserModel;
}
