import { Sequelize } from "sequelize-typescript";
import { Archive } from "./archive";

export const sequelize = new Sequelize({
	dialect: "mysql",
	database: "tmadb",
	username: "tma",
	host: process.env.DOCKER ?
		"db" :
		"localhost",
	password: "supersecret",
	port: 3002,
	models: [ Archive ]
});

export function sync() {
	return sequelize.sync({ alter: true });
}
