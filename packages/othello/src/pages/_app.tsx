import '../styles/index.scss'
import { AppProps } from "next/app";
import Head from "next/head";
import { DarkModeCtx } from "../contexts";
import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { DehydratedState, Hydrate } from "react-query/hydration";

declare global {
  interface Storage {
    setItem(key: "theme", value: "light" | "dark"): void;
    getItem(key: "theme"): string | null;
  }
}


export default function App({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

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
    <DarkModeCtx.Provider value={{ dark, setDark }}>
      <QueryClientProvider client={queryClientRef.current}>
        <Head>
          <link rel="icon" href="/favicon.ico"/>
          <link rel="manifest" href="/manifest.json"/>
          <title>TMA</title>
        </Head>

        <ReactQueryDevtools initialIsOpen={false}/>

        <Hydrate state={pageProps.dehydratedState}>
          <Component { ...pageProps }/>
        </Hydrate>
      </QueryClientProvider>
    </DarkModeCtx.Provider>
  );
}

export interface PageProps {
  dehydratedState: DehydratedState
}
