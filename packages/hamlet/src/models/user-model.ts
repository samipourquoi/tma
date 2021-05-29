import {
	AutoIncrement,
	BelongsTo,
	BelongsToMany,
	Column,
	ForeignKey, HasMany, HasOne,
	Model,
	PrimaryKey,
	Table, Unique
} from "sequelize-typescript";
import { Archive } from "./archive-model";
import { STRING } from "sequelize";
import { FtpUser } from "./ftp-user";
import { Like } from "./like-model";

export interface UserAttributes {
	discordID: string,
	name: string,
	email: string,
  avatar: base64
}

@Table
export class User
	extends Model<UserAttributes>
{
	@Unique
	@Column
	discordID!: string;

	@Unique
	@Column
	email!: string;

	@Column
	name!: string;

	@Column
  avatar!: base64;

	@HasMany(() => Archive)
	archives!: Archive[];

	@HasOne(() => FtpUser)
	ftp!: FtpUser;

	@HasMany(() => Like)
  likes!: Like[];
}
