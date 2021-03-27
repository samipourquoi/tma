import Layout from "../../components/layout";
import { GetServerSideProps } from "next";
import { GET_ArchiveFilesResult, GET_ArchiveResult } from "hamlet/api";
import { fetcher } from "../../api";
import Tag from "../../components/tag";
import styles from "../../styles/pages/archive/[id].module.scss";
import FileBrowser from "../../components/filebrowser";

export interface ArchiveViewProps {
  archive: GET_ArchiveResult,
  files: GET_ArchiveFilesResult
}

export default function ArchiveView({ archive, files }: ArchiveViewProps) {
  console.log(files);

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

        <h2>Author:</h2>
        {archive.author.name}

        <h2>Version:</h2>
        <Tag type={archive.version}/>

        <FileBrowser initialData={files} archive={archive}/>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ArchiveViewProps> = async context => {
  try {
    const { id } = context.query;
    const archive = await fetcher(`/api/archive/${id}`);
    const files: GET_ArchiveFilesResult = await fetch(`http://localhost:3001/archive/store/${id}`).then(res => res.json());

    return {
      props: {
        archive,
        files
      }
    }
  } catch (e) {
    console.log(e);
    return {
      notFound: true
    }
  }
}
