import { GET } from "hamlet/api";
import { fetcher } from "../api";

export function getUser(req: Request): GET.Auth.UserRes {
  // return fetcher("/auth/user", { req.o });
  console.log(req);
  return null;
}
