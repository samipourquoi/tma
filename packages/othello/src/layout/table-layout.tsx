import Head from "next/head";
import { Header } from "../components/header";
import Scrollbar from "react-smooth-scrollbar";
import { PageSelector } from "../components/widgets/page-selector";
import { VersionSelector } from "../components/widgets/version-selector";
import { Table } from "../components/table";
import React, { useContext, useState } from "react";
import { ApiResult } from "@tma/api";
import { DefaultLayout } from "./default-layout";
import { SearchCtx } from "../contexts";
import { ArchiveAttributes, FullArchiveAttributes } from "@tma/api/attributes";

const SearchBar: React.FC = () => {
  const {
    search: [, setSearch]
  } = useContext(SearchCtx);
  const [internal, setInternal] = useState("");

  return <input
    className="p-4 outline-none bg-contrast-400 rounded w-full"
    onChange={ev => setInternal(ev.currentTarget.value)}
    onKeyDown={ev => ev.key == "Enter" && setSearch(internal)}
    value={internal}
    placeholder="Search..."
  />;
}

export const TableLayout: React.FC<{
  archives: FullArchiveAttributes[],
  total: number,
  title: React.ReactNode
}> = ({ archives, total, title }) => {
  const {
    page: [page, setPage],
    version: [version, setVersion],
    search: [search],
    tags: [tags]
  } = useContext(SearchCtx);

  return (
    <div>
      <DefaultLayout title={title}>
        <div className="flex items-stretch justify-between mb-4">
          <div className="w-2/3">
            <SearchBar/>
          </div>

          <div className="flex">
            <div className="mx-4 flex">
              <PageSelector pageAmount={total} page={page} setPage={setPage}/>
            </div>

            <VersionSelector version={version} setVersion={setVersion}/>
          </div>
        </div>
      </DefaultLayout>

      <div className="absolute w-full">
        <Table rows={archives}/>
      </div>
    </div>
  )
}
