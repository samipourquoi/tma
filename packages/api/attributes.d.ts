import { TagType } from "./index";

// Attributes are the properties of each model that will always be
// accessible (no matter what includes/left-joins we use).

declare global {
  declare type base64 = string;
}

export interface Attributes {
  createdAt?: string,
  updatedAt?: string,
  id?: number
}

export interface UserAttributes
  extends Attributes
{
  discordID: string,
  name: string,
  email: string,
  avatar: base64
}

export interface ArchiveAttributes
  extends Attributes
{
  baseID: number,
  title: string,
  tags: TagType[],
  versions: string[],
  authorID: number,
  commit: string
}

export interface ArchiveBaseAttributes
  extends Attributes
{
  id: number
}

export interface LikeAttributes
  extends Attributes
{
  userID: number,
  archiveID: number
}

export interface SettingsAttributes
  extends Attributes {
}

export interface CommentAttributes
  extends Attributes
{
  authorID: number,
  archiveID: number,
  content: string,
  date: Date
}

export interface FtpUserAttributes
  extends Attributes
{
  userID: number,
  password: string,
  admin: boolean,
}

type GetIncludesOf<Attribute> =
  Attribute extends ArchiveAttributes ? { author: UserAttributes, likes: LikeAttributes[], base: ArchiveBaseAttributes } :
  never;

export type Includes<Attribute, Keys extends keyof GetIncludesOf<Attribute>> =
  Attribute & Pick<GetIncludesOf<Attribute>, Keys>;

type FullArchiveAttributes = Includes<ArchiveAttributes, "author" | "likes" | "base">
