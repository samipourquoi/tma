import { TagType } from "othello/src/components/tag";

export interface GET_ArchiveEntryInfo {
	author: string,
	title: string,
	version: string,
	tags: TagType[],
	date: Date,
	id: number
}
