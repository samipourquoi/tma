export const ip = process.env.NODE_ENV ?
	"http://localhost:3000" :
	"";
export const fetcher = (uri: string, ...args: any[]) => fetch(ip + uri, ...args).then(res => res.json());
