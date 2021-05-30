import { API } from "@tma/api";

declare type ApiResponse<Path extends keyof API, Method extends keyof API[Path] = "GET">
  = API[Path][Method]["response"];
