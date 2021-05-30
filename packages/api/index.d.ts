import { Response as TResponse } from "typera-common";
import { ArchiveAttributes, Includes, UserAttributes } from "./attributes";
export { TResponse };

export type TagType
  = "redstone"
  | "slimestone"
  | "storage"
  | "farms"
  | "mob-farms"
  | "bedrock"
  | "computational"
  | "other"
  | string;

export type ApiResponse<URI extends keyof API, Method extends keyof API[URI] | "GET" = "GET">
  = API[URI][Method]["response"] extends TResponse ? API[URI][Method]["response"] : never;

export interface API {
  "/auth/user": {
    GET: {
      response: TResponse.Ok<UserAttributes> | TResponse.Unauthorized
    }
  },
  "/auth/disconnect": {
    GET: {
      response: TResponse.ResetContent | TResponse.Unauthorized
    }
  },
  "/archive": {
    GET: {
      query: {
        page?: `${number}`,
        version?: string,
        tags?: TagType[]
      },
      response: TResponse.Ok<{
        archives: Includes<ArchiveAttributes, "author" | "likes">[];
        total: number
      }> | TResponse.BadRequest<string>
    }
  },
  "/archive/:id": {
    GET: {
      response: TResponse.Ok<Includes<ArchiveAttributes, "author" | "likes">> | TResponse.NotFound
    },
    POST: {
      request: any, // its using the multipart/form-data format
      response: TResponse.Created<ArchiveAttributes> | TResponse.Unauthorized | TResponse.BadRequest<string>
    }
  },
  "/archive/:id/store": {
    GET: {
      response: TResponse.Ok<string[]>
    }
  },
  "/archive/:id/store/:path": {
    GET: {
      response: TResponse.Ok<string> | TResponse.NotFound
    }
  },
  "/archive/:id/like": {
    POST: {
      response: TResponse.Ok<Includes<ArchiveAttributes, "author" | "likes">> | TResponse.Unauthorized
    }
  },
  "/ftp/password": {
    PUT: {
      body: {
        password: string
      },
      response: TResponse.Ok | TResponse.Unauthorized | TResponse.BadRequest<string>
    }
  }
}
