import '../styles/index.scss'
import { AppProps } from "next/app";
import Head from "next/head";
import { DarkModeCtx, SearchCtx } from "../contexts";
import React, { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { DehydratedState, Hydrate } from "react-query/hydration";
import Router from "next/router";
import { TAGS, VERSIONS } from "../constants";
import { ApiQuery } from "@tma/api";

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
      <SearchBarProvider searchQuery={(pageProps as PageProps)?.searchQuery}>
        <QueryClientProvider client={queryClientRef.current}>
          <Head>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="manifest" href="/manifest.json"/>
            <title>TMA</title>
          </Head>

          {process.env.NODE_ENV == "development" ?
            <ReactQueryDevtools initialIsOpen={false} position="top-right"/> :
            null}

          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps}/>
          </Hydrate>
        </QueryClientProvider>
      </SearchBarProvider>
    </DarkModeCtx.Provider>
  );
}

const SearchBarProvider: React.FC<{
  searchQuery?: ApiQuery<"/archive">
}> = ({ children, searchQuery }) => {
  const [searchString, setSearchString] = useState(searchQuery?.search || "");
  const [tags, setTags] = useState<Set<typeof TAGS[number] | string>>(new Set(searchQuery?.tags || []));
  const [version, setVersion] = useState(searchQuery?.version || "any");
  const [page, setPage] = useState(searchQuery?.page || 1);

  // useEffect(() => {
  //   if (Router.route != "/") {
  //     Router.push("/");
  //   }
  // }, [searchString]);

  return (
    <SearchCtx.Provider value={{
      search: [searchString, setSearchString],
      tags: [tags, setTags],
      version: [version, setVersion],
      page: [page, setPage]
    }}>
      {children}
    </SearchCtx.Provider>
  );
}

export interface PageProps {
  dehydratedState: DehydratedState,
  searchQuery?: ApiQuery<"/archive">
}
