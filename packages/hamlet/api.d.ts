import { ArchiveAttributes } from "./src/models/archive-model";
import { UserAttributes } from "./src/models/user-model";

export interface GET_ArchivesQuery {
	page?: number
}

export type GET_ArchivesResult = {
	archives: GET_ArchiveResult[],
	amount: number
};

export type GET_ArchiveResult = ArchiveAttributes & {
	createdAt: string,
	author: UserAttributes
};

export type GET_ArchiveFilesResult = string[];

export interface POST_Archive {

}

export module PUT {
	export module Ftp {
		export interface Password {
			password: string
		}
	}
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
