import { ArchiveAttributes } from "./src/models/archive-model";
import { UserAttributes } from "./src/models/user-model";

export interface GET_ArchivesQuery {
	page?: number,
	version?: string | number,
	// List of `TagType` separated by commas.
	tags?: string
}

export type GET_ArchivesResult = {
	archives: GET_ArchiveResult[],
	amount: number
};

export type GET_ArchiveResult = ArchiveAttributes & {
	createdAt: string,
	author: Pick<UserAttributes, "name">
};

export type GET_ArchiveFilesResult = string[];

export module POST {
	export interface Archive {
		title: string,
		readme: string,
		files?: unknown[],
		version: string,
		// List of `TagType` separated by commas.
		tags: string
	}
}

export module PUT {
	export module Ftp {
		export interface Password {
			password: string
		}
	}
}

export type TagType =
	"redstone"
	| "slimestone"
	| "storage"
	| "farms"
	| "mob-farms"
	| "bedrock"
	| "computational"
	| "other"
	| string;
