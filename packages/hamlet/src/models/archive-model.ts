import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "./user-model";
import { ARRAY, Optional, STRING, WhereOptions } from "sequelize";
import { Like } from "./like-model";
import { Comment } from "./comment-model";
import { ArchiveBaseAttributes, ArchiveAttributes } from "@tma/api/attributes";
import { ForModel } from "./index";
import { TagType } from "@tma/api";
import simpleGit from "simple-git";

/**
 * The difference between {ArchiveBase} and {Archive} is that
 * {ArchiveBase} includes data that doesn't change across versions.
 * For now there is only the actual archive ID.
 */

@Table
export class ArchiveBase
  extends Model<ForModel<ArchiveBaseAttributes>>
  implements ForModel<ArchiveBaseAttributes>
{
  // This is the actual archive ID.
  id!: number;

  @HasMany(() => Archive)
  archives!: Archive[]

  getLatestCommit = () =>
    ArchiveBase.getLatestCommit(this.id);

  static getLatestCommit(id: number) {
    const git = simpleGit(`../../store/${id}`);
    return git.log().then(commits => commits.latest!.hash.slice(0, 7));
  }
}

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

  @Column
  commit!: string;

  @ForeignKey(() => ArchiveBase)
  @Column
  baseID!: number;

  @BelongsTo(() => ArchiveBase)
  base!: ArchiveBase;

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
