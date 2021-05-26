import useSWR from "swr";
import { GET } from "hamlet/api";
import { fetcher } from "../api";

export function useUser(): GET.Auth.UserRes | undefined {
  return useSWR<GET.Auth.UserRes>("/api/auth/user", fetcher).data;
}
