export interface GET_Query_Archives {
	page?: number
}

export interface GET_ArchiveEntryInfo {
	author: string,
	title: string,
	version: string,
	tags: TagType[],
	date: Date,
	id: number
}

export interface POST_Archive {

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
