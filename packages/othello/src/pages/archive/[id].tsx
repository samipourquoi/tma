import { NewHeader } from "../../components/header";
import { Page } from "../../layout/page";
import { Preview } from "../../components/markdown";
import React from "react";
import { GET_ArchiveFilesResult, GET_ArchiveResult } from "hamlet/api";
import { GetServerSideProps } from "next";
import { fetcher, ip } from "../../api";
import Link from "next/link";
import { FileBrowser } from "../../components/file-browser";

interface ArchiveViewProps {
  archive: GET_ArchiveResult;
  files: GET_ArchiveFilesResult;
  readme: string;
}

export default function ArchiveView({ archive, files, readme }: ArchiveViewProps) {
  return (
    <Page>
      <section className="px-14 sm:px-20 lg:px-28 py-12">
        <h1 className="flex items-center uppercase">
          <Link href="/">
            <a>
              <span className="material-icons mr-1">first_page</span>
            </a>
          </Link>

          <span className="mb-1.5">
            {archive.title}
          </span>
        </h1>

        <div>
          <Preview content={readme}/>
          <FileBrowser initialData={files} archive={archive}/>
        </div>
      </section>
    </Page>
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
    return {
      notFound: true
    }
  }
}

