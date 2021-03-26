import Header from "../components/header";
import Layout from "../components/layout";
import Table, { Row } from "../components/table";
import styles from "../styles/pages/archive.module.scss";
import VersionSelector from "../components/widgets/version-selector";
import PageSelector from "../components/widgets/page-selector";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { fetcher } from "../api";

interface ArchivePageProps {
  entries: Row[]
}

export default function ArchivePage({ entries: rows }: ArchivePageProps) {
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
              <PageSelector pageAmount={10}/>
            </div>
          </div>
        </div>

        <Table rows={rows}/>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ArchivePageProps> = async context => {
  const entries: Row[] = await fetcher("/api/archive");

  return {
    props: {
      entries
    }
  }
}
