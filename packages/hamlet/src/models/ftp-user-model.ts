import { BelongsTo, Column, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { User } from "./user-model";
import { BOOLEAN, Optional } from "sequelize";

export interface FtpUserAttributes {
  userID: number,
  password: string,
  admin: boolean,
}

@Table
export class FtpUser
  extends Model<FtpUserAttributes,
    Optional<FtpUserAttributes,
      "admin">> {
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
