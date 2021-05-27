import '../styles/index.scss'
import { AppProps } from "next/app";
import Head from "next/head";
import { DarkModeCtx } from "../contexts";
import { useEffect, useState } from "react";

declare global {
  interface Storage {
    setItem(key: "theme", value: "light" | "dark"): void;
    getItem(key: "theme"): string | null;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem("theme") == "dark"
      || document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.documentElement.classList[dark ? "add" : "remove"]("dark");
  }, [dark]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="manifest" href="/manifest.json"/>
        <title>TMA</title>
      </Head>
      <DarkModeCtx.Provider value={{ dark, setDark }}>
        <Component { ...pageProps }/>
      </DarkModeCtx.Provider>
    </>
  );
}
