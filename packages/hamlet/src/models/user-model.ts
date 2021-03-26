import {
	AutoIncrement,
	BelongsTo,
	BelongsToMany,
	Column,
	ForeignKey, HasMany,
	Model,
	PrimaryKey,
	Table
} from "sequelize-typescript";
import { Archive } from "./archive-model";

export interface AuthorAttributes {
	name: string
}

@Table
export class User
	extends Model
{
	@Column
	name!: string;

	@HasMany(() => Archive)
	archives!: Archive[];
}
