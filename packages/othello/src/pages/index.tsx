import React, { useState } from "react";
import { NewHeader } from "../components/header";
import { Table } from "../components/table";
import { GetServerSideProps } from "next";
import { GET_ArchivesResult } from "hamlet/api";
import { fetcher } from "../api";
import useSWR from "swr";
import { PageSelector } from "../components/widgets/page-selector";
import { VersionSelector } from "../components/widgets/version-selector";
import Head from "next/head";

interface ArchivePageProps {
  initialData: GET_ArchivesResult
}

export default function ArchivePage({ initialData }: ArchivePageProps) {
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState("any");
  const { data } = useSWR<GET_ArchivesResult>(
    `/api/archive?page=${page-1}&version=${version}`,
    fetcher,
    { initialData: page == 1 ? initialData : void 0 });

  return (
    <div className="flex">
      <Head>
        <title>TMA - Home</title>
      </Head>

      <NewHeader/>

      <main className="w-full h-screen overflow-y-scroll">
        <section className="px-14 sm:px-20 lg:px-28 py-12">
          <h1 className="text-6xl">Archive</h1>
          <div className="flex md:items-center flex-col md:flex-row">
            <p className="mt-8 font-light text-gray-600">
              TMA is a place to archive Minecraft contraptions for Technical gameplay.
            </p>

            <div className="flex mt-4 md:mt-0 md:ml-auto children:mx-2">
              <PageSelector pageAmount={data?.amount || 1} page={page} setPage={setPage}/>
              <VersionSelector version={version} setVersion={setVersion}/>
            </div>
          </div>
        </section>

        <section>
          <Table rows={data?.archives || []}/>
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ArchivePageProps> = async context => {
  const initialData: GET_ArchivesResult = await fetcher("/api/archive");

  return {
    props: {
      initialData
    }
  };
}
