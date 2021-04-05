import { POST } from "hamlet/api";

export const ip = process.env.NODE_ENV ?
	"http://localhost:3000" :
	"";
export const fetcher = (uri: string, options?: RequestInit) => fetch(ip + uri, options).then(res => res.json());

export module API {
  export function postArchive(archive: POST.Archive) {
    return fetch("/api/archive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(archive)
    }).then(res => res.text());
  }
}
