import { Response } from "typera-common";
import { ArchiveAttributes, Includes, UserAttributes } from "./attributes";
import { Like } from "hamlet/dist/models/like-model";

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

export type ApiResponse<Path extends keyof API, Method extends keyof API[Path] = "GET">
  = API[Path][Method]["response"];

export interface API {
  "/auth/user": {
    GET: {
      response: Response.Ok<UserAttributes> | Response.Unauthorized
    }
  },
  "/auth/disconnect": {
    GET: {
      response: Response.ResetContent | Response.Unauthorized
    }
  },
  "/archive": {
    GET: {
      query: {
        page?: `${number}`,
        version?: string,
        tags?: TagType[]
      },
      response: Response.Ok<{
        archives: Includes<ArchiveAttributes, "author" | "likes">[];
        total: number
      }> | Response.BadRequest<string>
    }
  },
  "/archive/:id": {
    GET: {
      response: Response.Ok<Includes<ArchiveAttributes, "author" | "likes">> | Response.NotFound
    },
    POST: {
      request: any, // its using the multipart/form-data format
      response: Response.Created<ArchiveAttributes> | Response.Unauthorized | Response.BadRequest<string>
    }
  },
  "/archive/:id/store": {
    GET: {
      response: Response.Ok<string[]>
    }
  },
  "/archive/:id/store/:path": {
    GET: {
      response: Response.Ok<string> | Response.NotFound
    }
  },
  "/archive/:id/like": {
    POST: {
      response: Response.Ok<Includes<ArchiveAttributes, "author" | "likes">> | Response.Unauthorized
    }
  },
  "/ftp/password": {
    PUT: {
      body: {
        password: string
      },
      response: Response.Ok | Response.Unauthorized | Response.BadRequest<string>
    }
  }
}
