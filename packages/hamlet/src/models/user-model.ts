import {
	AutoIncrement,
	BelongsTo,
	BelongsToMany,
	Column,
	ForeignKey, HasMany,
	Model,
	PrimaryKey,
	Table, Unique
} from "sequelize-typescript";
import { Archive } from "./archive-model";
import { STRING } from "sequelize";

export interface AuthorAttributes {
	discordID: string,
	name: string
	email: string
}

@Table
export class User
	extends Model<AuthorAttributes>
{
	@Unique
	@Column
	discordID!: string;

	@Column
	email!: string;

	@Column
	name!: string;

	@HasMany(() => Archive)
	archives!: Archive[];
}
