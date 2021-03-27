import Header from "../../components/header";
import Layout from "../../components/layout";
import Table from "../../components/table";
import styles from "../../styles/pages/archive.module.scss";
import VersionSelector from "../../components/widgets/version-selector";
import PageSelector from "../../components/widgets/page-selector";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { fetcher } from "../../api";
import useSWR from "swr";
import { GET_ArchivesResult } from "hamlet/api";
import { useState } from "react";

interface ArchivePageProps {
  initialData: GET_ArchivesResult
}

export default function ArchiveListPage({ initialData }: ArchivePageProps) {
  const [page, setPage] = useState(1);
  const { data } = useSWR<GET_ArchivesResult>(
    `/api/archive?page=${page-1}`,
    fetcher,
    { initialData: page == 1 ? initialData : void 0 });

  return (
    <Layout header>
      <div className={styles["table-container"]}>
        <div className="layout-text">
          <h1>📖 Archive</h1>

          <div className={styles["desc-container"]}>
            <p className={styles["desc"]}>
              TMA is a place to archive Minecraft contraptions for Technical gameplay.
            </p>

            <div className={styles["desc-buttons"]}>
              <VersionSelector/>
              <PageSelector page={page}
                            setPage={setPage}
                            pageAmount={initialData.amount}/>
            </div>
          </div>
        </div>

        <Table rows={data?.archives || []}/>
      </div>
    </Layout>
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
