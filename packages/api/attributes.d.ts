import { TagType } from "./index";

// Attributes are the properties of each model that will always be
// accessible (no matter what includes/left-joins we use).

declare global {
  declare type base64 = string;
}

export interface UserAttributes {
  discordID: string,
  name: string,
  email: string,
  avatar: base64
}

export interface ArchiveAttributes {
  id: number,
  title: string,
  tags: TagType[],
  versions: string[],
  authorID: number
}

export interface LikeAttributes {
  userID: number,
  archiveID: number
}

export type IncludesOf<Attribute> =
  Attribute extends ArchiveAttributes ? { author: UserAttributes, likes: LikeAttributes[] } :
  never;

export type Includes<Attribute, Keys> =
  Attribute & Pick<IncludesOf<Attribute>, Keys>;
