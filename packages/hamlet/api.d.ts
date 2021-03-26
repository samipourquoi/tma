import { TagType } from "othello/src/components/tag";

export interface GET_ArchiveEntryInfo {
	author: string,
	title: string,
	version: string,
	tags: TagType[],
	date: Date,
	id: number
}

export type TagType = "redstone"
	| "slimestone"
	| "storage"
	| "farms"
	| "mob-farms"
	| "bedrock"
	| "computational"
	| "other"
	| string;
