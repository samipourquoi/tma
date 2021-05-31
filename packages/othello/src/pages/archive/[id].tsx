import { NewHeader } from "../../components/header";
import { Page } from "../../layout/page";
import { Preview } from "../../components/markdown";
import React, { useState } from "react";
import { GET_ArchiveFilesResult, GET_ArchiveResult } from "hamlet/api";
import { GetServerSideProps } from "next";
import { fetcher, getArchive, ip, likeArchive } from "../../api";
import Link from "next/link";
import { FileBrowser } from "../../components/file-browser";
import { Tag } from "../../components/tag";
import Head from "next/head";
import { LikeButton } from "../../components/like-button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ApiResponse, ApiResult } from "@tma/api";

interface ArchiveViewProps {
  id: number,
  initialArchive: ApiResult<"/archive/:id">,
  files: ApiResult<"/archive/:id/store">,
  readme: string
}

export default function ArchiveView({ id, initialArchive, files, readme }: ArchiveViewProps) {
  const queryClient = useQueryClient();
  const result = useQuery(["archive", id], () => getArchive(id), { initialData: initialArchive });
  const mutation = useMutation(likeArchive, {
    onSuccess: archive =>
      void queryClient.setQueryData(["archive", id], archive)
  });
  if (!result.isSuccess)
    return null;
  const { data: archive } = result;

  return (
    <Page>
      <Head>
        <title>TMA - {archive.title}</title>
      </Head>

      <h1 className="flex items-center uppercase">
        <Link href="/">
          <a>
            <span className="material-icons mr-1">first_page</span>
          </a>
        </Link>

        <span className="mb-1.5 break-all">
          {archive.title}
        </span>

        <ul className="mb-2 block ml-2.5">
          {archive.tags.map(tag =>
            <span className="mr-1.5">
              <Tag type={tag} key={tag}/>
            </span>
          )}
        </ul>
      </h1>

      <div className="block xl:flex">
        <section className="w-full xl:w-4/5 xl:pr-10">
          <div className="max-w-prose">
            <Preview content={readme}/>
          </div>
        </section>

        <section className="w-full xl:w-2/5 2xl:w-1/5">
          <div className="mb-1">
            <LikeButton archive={archive} onLike={() => {
              mutation.mutate(id);
            }}/>
          </div>

          <FileBrowser initialData={files} archive={archive}/>
        </section>
      </div>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<ArchiveViewProps> = async context => {
  try {
    let { id: queryId } = context.query;
    if (!queryId)
      return { notFound: true };

    // Let an archive with ID #1 and title 'Birch farm'.
    // I want the uri to access it to be /archive/1-birch-farm,
    // and not something like /archive/1 (you can't tell what the archive
    // is from the url if you don't include the title in it).
    //
    // However, you fetch an archive from the API with its ID.
    // So this checks if the URI is corresponding to the wanted format.
    const id = +(typeof queryId == "string" ?
      queryId.split("-")[0] :
      queryId);
    const initialArchive = await getArchive(id);
    if (context.query.id != getTitleUriFromArchive(initialArchive))
      return {
        notFound: true
      };

    const files = await fetcher("/archive/:id/store", { params: { id } }).then(f => f.body);
    const readme: string = await fetch(`${ip}/api/archive/${id}/store/readme.md`).then(res => res.text());

    return {
      props: { initialArchive, files, readme, id }
    }
  } catch (e) {
    console.log(e);
    return {
      notFound: true
    }
  }
}

export function getTitleUriFromArchive(archive: GET_ArchiveResult) {
  return `${archive.id}-${encodeURI(archive.title
    .toLowerCase()
    .replace(/( )|(%20)/g, "-"))}`;
}
