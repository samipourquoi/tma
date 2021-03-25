import Header from "../components/header";
import Layout from "../components/layout";
import Table, { Row } from "../components/table";
import styles from "../styles/pages/archive.module.scss";
import Tag from "../components/tag";
import VersionSelector from "../components/widgets/version-selector";

export default function ArchivePage() {
  const rows: Row[] = [
    {
      title: "birch farm",
      author: "samipourquoi",
      date: new Date(),
      version: "1.16.2",
      tags: (
        <>
          <Tag type="farms"/>
          <Tag type="redstone"/>
        </>
      ),
      id: 1
    },
  ];

  return (
    <Layout header>
      <div className={styles["table-container"]}>
        <div className="layout-text">
          <h1>📖 Archive</h1>

          <div className={styles["desc-container"]}>
            <p className={styles["desc"]}>
              TMA is a place to archive Minecraft contraptions for Technical gameplay.
            </p>
            <VersionSelector/>
          </div>
        </div>

        <Table rows={rows}/>
      </div>
    </Layout>
  );
}