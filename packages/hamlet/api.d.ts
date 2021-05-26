import { ArchiveAttributes } from "./src/models/archive-model";
import { UserAttributes } from "./src/models/user-model";

declare global {
  declare type base64 = string;
}

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

export module GET {
  export module Auth {
    export interface UserReq {}
    export type UserRes = User | null
  }
}

export module POST {
	export interface Archive {
		title: string,
		readme: string,
		files?: Hierarchy<string>,
    // List of strings separated by commas.
		versions: string,
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

export type Content = string | ArrayBuffer;

export type Hierarchy<T = Content> = { [k: string]: Hierarchy<T> | T };
