import { API, ApiQuery, ApiResponse, ApiResult } from "@tma/api";
import axios from "axios";

export const ip = (() => {
  if (process.env.DOCKER)
    return "http://host.docker.internal:2999"
  if (!process.browser)
    return "http://localhost:3000";
  return "";
})();

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
    }) & ({
      text?: boolean
    })
  ): Promise<ApiResponse<URI, Method>[number]> => {
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

    // const res = await fetch(url, options ? { ...options as object, body: data ? JSON.stringify(data) : undefined } : undefined)
    const res = await axios.request({
      method: options?.method || "GET" as any,
      url: url,
      data,
      headers: options?.headers,
      validateStatus: () => true
    });

    return {
      status: res.status,
      body: res.data,
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
      throw defaultError;
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

export const getFiles = async (id: number): Promise<ApiResult<"/archive/:id/store">> => {
  const res = await fetcher("/archive/:id/store", { params: { id } });
  return res.body;
};

export const getFile = async (id: number, path: string): Promise<ApiResult<"/archive/:id/store/:path">> => {
  const res = await fetcher("/archive/:id/store/:path", { params: { id, path }, text: true });
  switch (res.status) {
    case 200:
      return res.body;
    case 404:
      throw notFoundError;
  }
};

export const getUser = async (headers: Record<string, string> = {}): Promise<ApiResult<"/auth/user"> | null> => {
  const res = await fetcher("/auth/user", { headers });
  switch (res.status) {
    case 200:
      return res.body;
    case 401:
      return null;
  }
};

export const disconnect = async (): Promise<void> => {
  const res = await fetcher("/auth/disconnect", { text: true });
  switch (res.status) {
    case 205:
      break;
    case 401:
      throw unauthorized;
  }
}

export const getSaved = async (page: number, headers?: Record<string, string>): Promise<ApiResult<"/saved"> | null> => {
  const res = await fetcher("/saved", {
    headers,
    query: { page }
  });
  switch (res.status) {
    case 200:
      return res.body;
    case 400:
      throw defaultError;
    case 401:
      throw unauthorized;
  }
}
