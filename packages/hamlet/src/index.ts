import * as express from "express";
import { routes } from "./routes";
import { SQL } from "./database";

const port = +(process.env.PORT || 3001);

export const app = express();

app.use(routes);

app.listen(port, () => {
	SQL.script("setup");
	console.info(`API server listening to :${port}.`);
	console.info(`> http://localhost:${port}/`);
})
