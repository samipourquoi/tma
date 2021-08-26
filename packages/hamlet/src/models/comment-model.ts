import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Archive } from "./archive-model";
import { User } from "./user-model";
import { CommentAttributes } from "@tma/api/attributes";
import { ForModel } from "./index";



@Table
export class Comment
  extends Model<ForModel<CommentAttributes>>
{
  @ForeignKey(() => Archive)
  @Column
  archiveID!: number;

  @BelongsTo(() => Archive)
  archive!: Archive;

  @ForeignKey(() => User)
  @Column
  authorID!: number;

  @BelongsTo(() => User)
  author!: User;

  @Column
  content!: string;

  @Column
  date!: Date;
}
