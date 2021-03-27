import Layout from "../../components/layout";
import { GetServerSideProps } from "next";
import { GET_ArchiveFilesResult, GET_ArchiveResult } from "hamlet/api";
import { fetcher, ip } from "../../api";
import Tag from "../../components/tag";
import styles from "../../styles/pages/archive/[id].module.scss";
import FileBrowser from "../../components/filebrowser";
import MarkdownEditor from "../../components/filebrowser/markdown-editor";

export interface ArchiveViewProps {
  archive: GET_ArchiveResult,
  files: GET_ArchiveFilesResult,
  readme: string
}

export default function ArchiveView({ archive, files, readme }: ArchiveViewProps) {
  return (
    <Layout header>
      <div className="layout-text">
        <div className={styles.titles}>
          <h1>
            {archive.title}
          </h1>
          <span className={styles.tags}>
            {archive.tags.map(tag => <Tag key={tag} type={tag}/>)}
          </span>
        </div>

        <MarkdownEditor initialContent={readme}/>

        <FileBrowser initialData={files} archive={archive}/>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ArchiveViewProps> = async context => {
  try {
    const { id } = context.query;
    const archive = await fetcher(`/api/archive/${id}`);
    const files: GET_ArchiveFilesResult = await fetcher(`/api/archive/store/${id}`);
    const readme: string = await fetch(`${ip}/api/archive/store/${id}/README.md`).then(res => res.text());

    return {
      props: {
        archive,
        files,
        readme
      }
    }
  } catch (e) {
    console.log(e);
    return {
      notFound: true
    }
  }
}
