import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { SettingsAttributes } from "@tma/api/attributes";
import { User } from "./user-model";

@Table
export class Settings
  extends Model<SettingsAttributes>
{
  @ForeignKey(() => User)
  @Column
  userID!: number;

  @BelongsTo(() => User)
  user!: User;
}
