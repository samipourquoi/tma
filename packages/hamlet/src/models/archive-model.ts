import {
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey, HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { User } from "./user-model";
import { TagType } from "../../api";
import { ARRAY, INTEGER, Optional, STRING } from "sequelize";
import { Like } from "./like-model";

export interface ArchiveAttributes {
	id: number,
	title: string,
	tags: TagType[],
	versions: string[],
	authorID: number
}

@Table
export class Archive
	extends Model<
		ArchiveAttributes,
		Optional<
			ArchiveAttributes,
			"id">>
{
	@Column
	title!: string;

	@Column(ARRAY(STRING))
	tags!: TagType[];

	@Column(ARRAY(STRING))
	versions!: string[];

	@BelongsTo(() => User)
	author!: User;

	@ForeignKey(() => User)
	@Column
	authorID!: number;

  @HasMany(() => Like)
  likes!: Like[];
}
