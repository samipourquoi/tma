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
import { SearchSystem } from "./search-system";
import * as _store from "session-file-store";
const FileStore = _store(session);

const port = +(process.env.PORT || 3001);
export const app = express();

app.use(session({
  genid: () => uuid(),
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  store: new FileStore({ path: "../../tmp/sessions", logFn: () => void 0 })
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.listen(port, async () => {
  await sync();
  SearchSystem.init();
  console.info(`API server listening to :${port}.`);
  console.info(`> http://localhost:${port}/`);
});
