import { Response as TResponse } from "typera-common";
import {
  ArchiveBaseAttributes,
  ArchiveAttributes,
  Includes,
  UserAttributes,
  FullArchiveAttributes
} from "./attributes";
export { TResponse };

export type TagType = string;

/** The result is the data you're fetching. */
export type ApiResult<URI extends keyof API, Method extends keyof API[URI] | "GET" = "GET">
  = ApiResponse<URI, Method>[0]["body"]
/** The response is all the kind of response you will get. */
export type ApiResponse<URI extends keyof API, Method extends keyof API[URI] | "GET" = "GET">
  = API[URI][Method]["response"] extends TResponse[] ? API[URI][Method]["response"] : never;
export type ApiQuery<URI extends keyof API, Method extends keyof API[URI] | "GET" = "GET">
  = API[URI][Method]["query"];

export interface API {
  "/auth/user": {
    GET: {
      response: [TResponse.Ok<UserAttributes>, TResponse.Unauthorized]
    }
  },
  "/auth/disconnect": {
    GET: {
      response: [TResponse.ResetContent, TResponse.Unauthorized]
    }
  },
  "/archive": {
    GET: {
      query: {
        page: number,
        version: string,
        tags: TagType[],
        search: string
      },
      response: [TResponse.Ok<{
        archives: FullArchiveAttributes[];
        total: number
      }>, TResponse.BadRequest<string>]
    },
    POST: {
      body: {
        title: string,
        readme: object,
        tags: TagType[],
      },
      response: [TResponse.Created<FullArchiveAttributes>, TResponse.Unauthorized, TResponse.BadRequest<string>]
    }
  },
  "/archive/:id": {
    GET: {
      params: { id: number },
      query: { commit?: string }
      response: [TResponse.Ok<FullArchiveAttributes>, TResponse.NotFound, TResponse.BadRequest<string>]
    }
  },
  "/archive/:id/commits": {
    GET: {
      params: { id: number },
      response: [TResponse.Ok<{ date: string, hash: string }[]>, TResponse.NotFound]
    }
  },
  "/archive/:id/store": {
    GET: {
      params: { id: number },
      query: { path: string, commit?: string }
      response: [TResponse.Ok<string[] | string>, TResponse.NotFound, TResponse.BadRequest<string>]
    },
    POST: {
      params: { id: number },
      body: FormData,
      response: [TResponse.Created, TResponse.Unauthorized, TResponse.BadRequest<string>]
    },
    DELETE: {
      params: { id: number },
      body: { paths: string[] },
      response: [TResponse.Ok, TResponse.Unauthorized, TResponse.BadRequest<string>]
    }
  },
  "/archive/:id/like": {
    POST: {
      params: { id: number },
      response: [TResponse.Ok<FullArchiveAttributes>, TResponse.Unauthorized, TResponse.BadRequest]
    }
  },
  "/ftp/password": {
    PUT: {
      body: {
        password: string
      },
      response: [TResponse.Ok, TResponse.Unauthorized, TResponse.BadRequest<string>]
    }
  },
  "/saved": {
    GET: {
      query: {
        page: number
      },
      response: [TResponse.Ok<{
        archives: Includes<FullArchiveAttributes>[],
        total: number
      }>, TResponse.BadRequest<string> | TResponse.Unauthorized]
    }
  },
  "/settings": {
    GET: {
      response: [TResponse.Ok | TResponse.Unauthorized]
    },
    PUT: {
      response: [TResponse.Ok | TResponse.BadRequest<string> | TResponse.Unauthorized]
    }
  }
}
