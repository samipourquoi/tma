import { API, ApiQuery, ApiResponse, ApiResult } from "@tma/api";
import { useQuery } from "react-query";

export const ip = process.env.NODE_ENV ?
	"http://localhost:3000" :
	"";

// This basically maps the API, enforcing the right URI, HTTP verb,
// request body, and response code.
export const fetcher =
  async <URI extends keyof API, Method extends keyof API[URI] = "GET" extends keyof API[URI] ? "GET" : never>
  (
    uri: URI,
    options?: RequestInit & (Method extends "GET" ? {
      method?: Method
    } : {
      method: Method
    }) & ("body" extends keyof API[URI][Method] ? {
      data: API[URI][Method]["body"]
    } : {
      data?: never
    }) & ("params" extends keyof API[URI][Method] ? {
      params: API[URI][Method]["params"]
    } : {
      params?: never
    }) & ("query" extends keyof API[URI][Method] ? {
      query: API[URI][Method]["query"]
    } : {
      query?: never
    })
  ): Promise<ApiResponse<URI, Method>[number]> =>
{
  const data = options?.data;
  const params = (options?.params || {}) as Record<string, any>;
  const query = options?.query;
  let url = `${ip}/api/${uri.startsWith("/") ? uri.slice(1) : uri}`;
  Object.entries(params).forEach(([key, value]) => url = url.replace(`:${key}`, value));

  if (query) {
    url += "?" + Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
  }

  const res = await fetch(url, options ? { ...options as object, body: data ? JSON.stringify(data) : undefined } : undefined)

  return {
    status: res.status,
    body: await res.json(),
    headers: res.headers
  } as unknown as ApiResponse<URI, Method>;
}

const defaultError = new Error("an unexpected error has occured");
const notFoundError = new Error("not found");
const unauthorized = new Error("login first");

export const getArchive = async (id: number): Promise<ApiResult<"/archive/:id">> => {
  const res = await fetcher("/archive/:id", { params: { id } });
  switch (res.status) {
    case 200:
      return res.body;
    default:
      throw defaultError;
  }
};

export const getArchives = async (query: ApiQuery<"/archive">): Promise<ApiResult<"/archive">> => {
  const res = await fetcher(`/archive`, { query });
  switch (res.status) {
    case 200:
      return res.body;
    case 400:
      throw notFoundError;
  }
};

export const likeArchive = async (id: number): Promise<ApiResult<"/archive/:id/like", "POST">> => {
  const res = await fetcher("/archive/:id/like", { method: "POST", params: { id } });
  switch (res.status) {
    case 200:
      return res.body;
    case 401:
      throw unauthorized;
  }
};
