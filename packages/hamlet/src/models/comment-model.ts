import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Archive } from "./archive-model";
import { User } from "./user-model";

export interface CommentAttributes {
  authorID: number,
  archiveID: number,
  content: string,
  date: Date
}

@Table
export class Comment
  extends Model<CommentAttributes>
  implements CommentAttributes
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
