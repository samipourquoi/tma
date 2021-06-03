import { createContext } from "react";

export const DarkModeCtx = createContext<{
  readonly dark: boolean,
  setDark(dark: boolean): void
}>({
  dark: false,
  setDark() {
  }
});
