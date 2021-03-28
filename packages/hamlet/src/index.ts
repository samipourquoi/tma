import { loadConfig } from "./config";

export const config = loadConfig();
console.log(config);

import * as express from "express";
import "./auth/strategies";
import { routes } from "./routes";
import { sync } from "./models";
import { Archive } from "./models/archive-model";
import "./ftp";
import * as session from "express-session";
import { v4 as uuid } from 'uuid';
import * as passport from "passport";

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
app.use(routes)

app.listen(port, async () => {
	await sync();
	console.info(`API server listening to :${port}.`);
	console.info(`> http://localhost:${port}/`);
});
