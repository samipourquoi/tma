import React, { useState } from "react";
import { NewHeader } from "../components/header";
import { Table } from "../components/table";
import { GetServerSideProps } from "next";
import { GET_ArchivesResult } from "hamlet/api";
import { fetcher, getArchives, getUser } from "../api";
import useSWR from "swr";
import { PageSelector } from "../components/widgets/page-selector";
import { VersionSelector } from "../components/widgets/version-selector";
import Head from "next/head";
import Scrollbar from "react-smooth-scrollbar";
import { QueryClient, useQuery } from "react-query";
import { dehydrate, DehydratedState } from "react-query/hydration";
import { PageProps } from "./_app";

interface ArchivePageProps extends PageProps {
  initialPage: number,
  initialVersion: string
}

export default function ArchivePage({ initialPage, initialVersion }: ArchivePageProps) {
  const [page, setPage] = useState(initialPage);
  const [version, setVersion] = useState(initialVersion);
  const { data } = useQuery(["archives", page],
    () => getArchives({ page, version, tags: [] }),
    { keepPreviousData: true });

  return (
    <div className="flex bg-contrast-300 text-contrast-800">
      <Head>
        <title>TMA - Home</title>
      </Head>

      <NewHeader/>

      <div className="w-full">
        <Scrollbar>
          <main className="w-full h-screen">
            <section className="px-10 sm:px-20 lg:px-28 py-12">
              <h1 className="text-6xl">Archive</h1>
              <div className="flex md:items-center flex-col md:flex-row">
                <p className="mt-8 font-light text-contrast-700">
                  TMA is a place to archive Minecraft contraptions for Technical gameplay.
                </p>

                <div className="flex flex-wrap justify-center children:mb-2 md:children:mt-0 md:justify-start md:flex-nowrap mt-4 md:mt-0 md:ml-auto children:mx-2">
                  <PageSelector pageAmount={data?.total || 1} page={page} setPage={setPage}/>
                  <VersionSelector version={version} setVersion={setVersion}/>
                </div>
              </div>
            </section>

            <section>
              <Table rows={data?.archives || []}/>
            </section>
          </main>
        </Scrollbar>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ArchivePageProps> = async context => {
  const queryClient = new QueryClient();
  const { page = "1", version = "any", tags = "" } = context.query as NodeJS.Dict<string>;

  await queryClient.prefetchQuery(["archives", +page], () => getArchives({ page: +page, version, tags: tags.split(",") }));
  await queryClient.prefetchQuery("user", () => getUser({ cookie: context.req.headers.cookie! }));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialPage: +page,
      initialVersion: version
    }
  };
}
