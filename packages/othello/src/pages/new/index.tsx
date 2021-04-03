import React, { useState } from "react";
import { NewHeader } from "../../components/new/header";
import { Table } from "../../components/new/table";
import { GetServerSideProps } from "next";
import { GET_ArchivesResult } from "hamlet/api";
import { fetcher } from "../../api";
import useSWR from "swr";

interface ArchivePageProps {
  initialData: GET_ArchivesResult
}

export default function ArchivePage({ initialData }: ArchivePageProps) {
  const [page, setPage] = useState(1);
  const { data } = useSWR<GET_ArchivesResult>(
    `/api/archive?page=${page-1}`,
    fetcher,
    { initialData: page == 1 ? initialData : void 0 });

  if (!data)
    return null;

  return (
    <div className="flex">
      <NewHeader/>
      <Table rows={data.archives}/>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ArchivePageProps> = async context => {
  const initialData: GET_ArchivesResult = await fetcher("/api/archive");

  return {
    props: {
      initialData
    }
  }
}
