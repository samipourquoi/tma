import { Column, HasMany, HasOne, Model, Table, Unique } from "sequelize-typescript";
import { Archive } from "./archive-model";
import { FtpUser } from "./ftp-user-model";
import { Like } from "./like-model";
import { Comment } from "./comment-model";
import { UserAttributes } from "@tma/api/attributes";
import { Settings } from "./settings-model";
import { ForModel } from "./index";

@Table
export class User
  extends Model<ForModel<UserAttributes>>
{
  id!: number;

  @Unique
  @Column
  discordID!: string;

  @Unique
  @Column
  email!: string;

  @Column
  name!: string;

  @Column
  avatar!: base64;

  @HasMany(() => Archive)
  archives!: Archive[];

  @HasOne(() => FtpUser)
  ftp!: FtpUser;

  @HasMany(() => Like)
  likes!: Like[];

  @HasMany(() => Comment)
  comments!: Comment[];

  @HasOne(() => Settings)
  settings!: Settings;
}
