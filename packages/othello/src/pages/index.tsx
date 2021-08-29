import React, { useContext, useState } from "react";
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
    <TableLayout rows={archives.data?.archives || []}>
      <Head>
        <title>TMA - Home</title>
      </Head>

      <h1 className="text-6xl">Archive</h1>
      <div className="flex md:items-center flex-col md:flex-row">
        <p className="mt-8 font-light text-contrast-700">
          TMA is a place to archive Minecraft contraptions for Technical gameplay.
        </p>

        <div className="
          flex flex-wrap justify-center children:mb-2 md:children:mt-0 md:justify-start
          md:flex-nowrap mt-4 md:mt-0 md:ml-auto children:mx-2
        ">
          <PageSelector pageAmount={archives.data?.total || 1} page={page} setPage={setPage}/>
          <VersionSelector version={version} setVersion={setVersion}/>
        </div>
      </div>
    </TableLayout>
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
