import { promisify } from "util";
import * as SQLite3 from "sqlite3";
import { execSync } from "child_process";

export module SQL {
	const dbDir = "../../db"
	export const db: SQLite3.Database = new SQLite3.Database(`${dbDir}/main.db`);

	export const all: (sql: string, ...params: any[]) => Promise<unknown[]>
		= promisify(db.all).bind(db) as any;
	export const get: (sql: string, ...params: any[]) => Promise<unknown>
		= promisify(db.get).bind(db) as any;
	export const run: (sql: string, ...params: any[]) => Promise<void>
		= promisify(db.run).bind(db) as any;

	export function script(name: string) {
		let path = `${dbDir}/${name}${name.endsWith(".sql") ? "" : ".sql" }`;
		execSync(`sqlite3 ${dbDir}/main.db < ${ path }`);
	}
}
