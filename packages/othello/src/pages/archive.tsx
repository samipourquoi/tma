import Header from "../components/header";
import Layout from "../components/layout";
import Table from "../components/table";
import styles from "../styles/pages/archive.module.scss";

export default function ArchivePage() {
  return (
    <Layout header>
      <div className={styles["table-container"]}>
        <div className="layout-text">
          <h1>📖 Archive</h1>
          <p>TMA is a place to archive Minecraft contraptions for Technical gameplay.</p>
        </div>

          <Table rows={
            /* @ts-ignore */
            [{title: "hello"}, {title: "world"}]
          }/>
      </div>
    </Layout>
  );
}
