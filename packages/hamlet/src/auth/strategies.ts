import * as passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { config } from "../index";
import { User } from "../models/user-model";

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj as Express.User));

passport.use(new DiscordStrategy({
  ...config.auth,
  scope: ["identify", "email"],
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({
      where: {
        discordID: profile.id
      }
    });

    if (!user) {
      return await User.create({
        discordID: profile.id,
        name: profile.username,
        avatar: profile.avatar,
        email: profile.email!
      }).then(user => cb(null, user))
    } else {
      return user.set("avatar", profile.avatar)
        .save()
        .then(user => cb(null, user));
    }
  } catch (e) {
    cb(e);
  }
}));
