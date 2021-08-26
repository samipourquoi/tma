import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user-model";
import { TagType } from "../../api";
import { ARRAY, Optional, STRING } from "sequelize";
import { Like } from "./like-model";
import { Comment } from "./comment-model";
import { ArchiveAttributes } from "@tma/api/attributes";
import { ForModel } from "./index";

@Table
export class Archive
  extends Model<ForModel<ArchiveAttributes>>
  implements ForModel<ArchiveAttributes>
{
  id!: number;

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

  @HasMany(() => Comment)
  comments!: Comment;
}
