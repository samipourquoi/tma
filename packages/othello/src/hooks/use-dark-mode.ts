import { useContext } from "react";
import { DarkModeCtx } from "../contexts";

export function useDarkMode(): readonly [boolean, (dark: boolean) => void] {
  const { dark, setDark } = useContext(DarkModeCtx);
  return [dark, setDark];
}

