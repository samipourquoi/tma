import { Response } from "typera-common";

export interface API {
  "/auth/user": {
    GET: {
      response: Response.Ok | Response.Unauthorized
    }
  },
  "/auth/disconnect": {
    GET: {
      response:
        Response.ResetContent | Response.Unauthorized
    }
  }
}
