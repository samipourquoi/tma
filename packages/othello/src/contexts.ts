import { createContext } from "react";
import { VERSIONS } from "./constants";
import { ArchiveAttributes } from "@tma/api/attributes";

type UseState<T> = [T, (state: T) => void];

export const DarkModeCtx = createContext<{
  readonly dark: boolean,
  setDark(dark: boolean): void
}>({
  dark: false,
  setDark() {
  }
});

export const SearchCtx = createContext<Readonly<{
  search: UseState<string>,
  tags: UseState<Set<string>>,
  page: UseState<number>,
  version: UseState<string>
}>>(null as any);

export const EditorCtx = createContext<{
  editing: boolean,
  files?: UseState<Set<File>>
}>(null as any);

export const ArchiveViewCtx = createContext<
  ArchiveAttributes | null
>(null);
