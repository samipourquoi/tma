import { API, ApiResponse } from "@tma/api";
import { Route } from "typera-express";

export type ApiRoute<URI extends keyof API, Method extends keyof API[URI] = "GET">
  = Route<ApiResponse<URI, Method>[number]>
