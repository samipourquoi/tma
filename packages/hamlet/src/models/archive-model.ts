import { AutoIncrement, BelongsTo, Column, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user-model";

export interface ArchiveAttributes {
	id: number,
	title: string,
	authorID: number
}

@Table
export class Archive
	extends Model<ArchiveAttributes>
{
	@Column
	title!: string;

	@BelongsTo(() => User)
	author!: User;

	@ForeignKey(() => User)
	@Column
	authorID!: number;
}
