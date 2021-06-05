import { createContext } from "react";
import { VERSIONS } from "./constants";

export const DarkModeCtx = createContext<{
  readonly dark: boolean,
  setDark(dark: boolean): void
}>({
  dark: false,
  setDark() {
  }
});

export const SearchCtx = createContext<Readonly<{
  search: [string, (str: string) => void],
  tags: [Set<string>, (set: Set<string>) => void],
  page: [number, (number: number) => void],
  version: [string, (version: string) => void]
}>>(null as any);
