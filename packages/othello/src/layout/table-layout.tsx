import Head from "next/head";
import { NewHeader } from "../components/header";
import Scrollbar from "react-smooth-scrollbar";
import { PageSelector } from "../components/widgets/page-selector";
import { VersionSelector } from "../components/widgets/version-selector";
import { Table } from "../components/table";
import React from "react";
import { ApiResult } from "@tma/api";

export const TableLayout: React.FC<{
  rows: ApiResult<"/archive/:id">[]
}> = ({ rows, children }) => (
  <div className="flex bg-contrast-300 text-contrast-800">
    <NewHeader/>

    <div className="w-full">
      <Scrollbar>
        <main className="w-full h-screen">
          <section className="px-10 sm:px-20 lg:px-28 py-12">
            {children}
          </section>

          <section>
            <Table rows={rows}/>
          </section>
        </main>
      </Scrollbar>
    </div>
  </div>
)
