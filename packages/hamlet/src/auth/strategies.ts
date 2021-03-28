import * as passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { config } from "../index";

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj as Express.User));

passport.use(new DiscordStrategy({
	...config.auth,
	scope: ["identify"],
}, (accessToken, refreshToken, profile, cb) => {
	return cb(null, profile);
}));
