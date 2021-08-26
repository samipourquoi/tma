import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { User } from "./user-model";
import { BOOLEAN, Optional } from "sequelize";
import { ForModel } from "./index";
import { FtpUserAttributes } from "@tma/api/attributes";

@Table
export class FtpUser
  extends Model<
    ForModel<ForModel<FtpUserAttributes>>,
    Optional<ForModel<FtpUserAttributes>, "admin">
  >
{
  @Column
  password!: string;

  @Column({ type: BOOLEAN, defaultValue: false })
  admin!: boolean;

  @Unique
  @ForeignKey(() => User)
  @Column
  userID!: number;

  @BelongsTo(() => User)
  user!: User;
}
