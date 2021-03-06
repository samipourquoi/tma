import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user-model";
import { Archive } from "./archive-model";
import { LikeAttributes } from "@tma/api/attributes";
import { ForModel } from "./index";

@Table
export class Like
  extends Model<ForModel<LikeAttributes>>
{
  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  userID!: number;

  @PrimaryKey
  @ForeignKey(() => Archive)
  @Column
  archiveID!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Archive)
  archive!: Archive;
}
