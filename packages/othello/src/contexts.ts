import { createContext } from "react";
import { GET, Hierarchy } from "hamlet/api";

export const SubmitCtx = createContext<{
  setVersions(versions: string[]): void,
  setTags    (tags: string[]):     void,
  setReadme  (readme: string):     void,
  setFiles   (files: Hierarchy):   void
}>({
  setFiles   () {},
  setReadme  () {},
  setTags    () {},
  setVersions() {}
});

export const UserCtx = createContext<GET.Auth.UserRes>(null);