import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { SettingsAttributes } from "@tma/api/attributes";
import { User } from "./user-model";
import { ForModel } from "./index";

@Table
export class Settings
  extends Model<ForModel<SettingsAttributes>>
{
  @ForeignKey(() => User)
  @Column
  userID!: number;

  @BelongsTo(() => User)
  user!: User;
}
