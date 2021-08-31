import React, { useContext, useEffect, useState } from "react";
import { Header } from "../components/header";
import { Table } from "../components/table";
import { GetServerSideProps } from "next";
import { getArchives, getUser } from "../api";
import { PageSelector } from "../components/widgets/page-selector";
import { VersionSelector } from "../components/widgets/version-selector";
import Head from "next/head";
import Scrollbar from "react-smooth-scrollbar";
import { QueryClient, useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import { PageProps } from "./_app";
import { TableLayout } from "../layout/table-layout";
import { SearchCtx } from "../contexts";
import { ApiQuery } from "@tma/api";

interface ArchivePageProps extends PageProps {
  initialPage: number,
  initialVersion: string
}

export default function ArchivePage({ initialPage, initialVersion }: ArchivePageProps) {
  const {
    page: [page, setPage],
    version: [version, setVersion],
    search: [search],
    tags: [tags]
  } = useContext(SearchCtx);
  const query: ApiQuery<"/archive"> = { page, search, tags: Array.from(tags), version }

  const archives = useQuery(["archives", query],
    () => getArchives(query),
    { keepPreviousData: true });

  return (
    <>
      <Head>
        <title>TMA - Home</title>
      </Head>

      <TableLayout title={
        <>
          <h1 className="text-6xl">Archive</h1>
          <p className="mt-4">Save an archive by clicking on the heart icon</p>
        </>
      } archives={archives.data?.archives || []} total={archives.data?.total || 1}/>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ArchivePageProps> = async context => {
  const queryClient = new QueryClient();
  const { page = "1", version = "any", tags = "", search = "" } = context.query as NodeJS.Dict<string>;
  const query: ApiQuery<"/archive"> = {
    page: +page,
    version,
    tags: tags.split(","),
    search
  };

  await queryClient.prefetchQuery(["archives", query], () => getArchives(query));
  const { cookie } = context.req.headers;
  await queryClient.prefetchQuery("user", () => getUser(cookie ? { cookie } : {}));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialPage: +page,
      initialVersion: version
    }
  };
}
