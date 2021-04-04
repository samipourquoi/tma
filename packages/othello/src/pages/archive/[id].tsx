import { NewHeader } from "../../components/header";
import { Page } from "../../layout/page";
import { Preview } from "../../components/markdown";
import React from "react";
import { GET_ArchiveFilesResult, GET_ArchiveResult } from "hamlet/api";
import { GetServerSideProps } from "next";
import { fetcher, ip } from "../../api";
import Link from "next/link";
import { FileBrowser } from "../../components/file-browser";
import { Tag } from "../../components/tag";

interface ArchiveViewProps {
  archive: GET_ArchiveResult;
  files: GET_ArchiveFilesResult;
  readme: string;
}

export default function ArchiveView({ archive, files, readme }: ArchiveViewProps) {
  return (
    <Page>
      <h1 className="flex items-center uppercase">
        <Link href="/">
          <a>
            <span className="material-icons mr-1">first_page</span>
          </a>
        </Link>

        <span className="mb-1.5">
          {archive.title}
        </span>

        <ul className="mb-2 block ml-2.5">
          {archive.tags.map(tag => (
            <span className="mr-1.5">
              <Tag type={tag} key={tag}/>
            </span>
          ))}
        </ul>
      </h1>

      <div className="block xl:flex">
        <section className="w-full xl:w-4/5 xl:pr-10">
          <Preview content={readme}/>
        </section>

        <section className="w-full xl:w-2/5 2xl:w-1/5">
          <FileBrowser initialData={files} archive={archive}/>
        </section>
      </div>
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

