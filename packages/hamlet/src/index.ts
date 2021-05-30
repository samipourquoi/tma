import { loadConfig } from "./config";
export const config = loadConfig();

import "./models";
import * as express from "express";
import "./auth/strategies";
import { routes } from "./routes";
import { sync } from "./models";
import "./ftp";
import * as session from "express-session";
import { v4 as uuid } from 'uuid';
import * as passport from "passport";
import * as IORedis from "ioredis";

export const redis = new IORedis({
  port: 3003,
  host: process.env.DOCKER ?
    "cache" :
    "localhost"
});

const port = +(process.env.PORT || 3001);
export const app = express();

app.use(session({
	genid: () => uuid(),
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.listen(port, async () => {
	await sync();
	console.info(`API server listening to :${port}.`);
	console.info(`> http://localhost:${port}/`);
});
