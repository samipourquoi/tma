import { API, ApiResponse } from "@tma/api";

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
    })
  ): Promise<ApiResponse<URI, Method>> =>
{
  const data = options?.data;
  const res = await fetch(`${ip}/api/${uri}`, options ? { ...options as object, body: data ? JSON.stringify(data) : undefined } : undefined)

  return {
    status: res.status,
    body: await res.json(),
    headers: res.headers
  } as unknown as ApiResponse<URI, Method>;
}
