import { Sequelize } from "sequelize-typescript";
import { Archive } from "./archive-model";
import { User } from "./user-model";
import { FtpUser } from "./ftp-user-model";
import { Like } from "./like-model";
import { Comment } from "./comment-model";

export const sequelize = new Sequelize({
  logging: false,
  dialect: "postgres",
  database: "tmadb",
  username: "tma",
  host: process.env.DOCKER ?
    "db" :
    "localhost",
  password: "supersecret",
  port: 3002,
  models: [Archive, User, FtpUser, Like, Comment],
  omitNull: true
});

export async function sync() {
  await sequelize.sync({ alter: true });
}
