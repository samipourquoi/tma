import * as express from "express";
import { routes } from "./routes";
import { sync } from "./models";
import { Archive } from "./models/archive";

const port = +(process.env.PORT || 3001);
export const app = express();
app.use(routes);

app.listen(port, async () => {
	await sync();
	console.info(`API server listening to :${port}.`);
	console.info(`> http://localhost:${port}/`);
})
