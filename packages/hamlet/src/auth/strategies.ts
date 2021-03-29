import * as passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { config } from "../index";
import { User } from "../models/user-model";
import { FtpUser } from "../models/ftp-user";

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj as Express.User));

passport.use(new DiscordStrategy({
	...config.auth,
	scope: ["identify", "email"],
}, async (accessToken, refreshToken, profile, cb) => {
	try {
		const [user] = await User.findOrCreate({
			where: {
				discordID: profile.id,
				name: profile.username,
				email: profile.email
			}
		});

		cb(null, user);
	} catch(e) {
		cb(e);
	}
}));
