import { Page } from "../../layout/page";
import { Preview } from "../../components/markdown";
import React from "react";
import { GetServerSideProps } from "next";
import { getArchive, getFile, getFiles, getUser, likeArchive } from "../../api";
import Link from "next/link";
import { FileBrowser } from "../../components/file-browser";
import { Tag } from "../../components/tag";
import Head from "next/head";
import { LikeButton } from "../../components/like-button";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { ApiResult } from "@tma/api";
import { PageProps } from "../_app";
import { dehydrate } from "react-query/hydration";

interface ArchiveViewProps extends PageProps {
  id: number
}

export default function ArchiveView({ id }: ArchiveViewProps) {
  const queryClient = useQueryClient();
  const archive = useQuery(["archive", id], () => getArchive(id));
  const files = useQuery(["files", id], () => getFiles(id));
  const readme = useQuery(["file", id, "readme.md"], () => getFile(id, "readme.md"));
  const mutation = useMutation(likeArchive, {
    onSuccess: archive =>
      void queryClient.setQueryData(["archive", id], archive)
  });
  if (!(archive.isSuccess && files.isSuccess && readme.isSuccess))
    return null;

  return (
    <Page>
      <Head>
        <title>TMA - {archive.data.title}</title>
      </Head>

      <h1 className="flex items-center uppercase">
        <Link href="/">
          <a>
            <span className="material-icons mr-1">first_page</span>
          </a>
        </Link>

        <span className="mb-1.5 break-all">
          {archive.data.title}
        </span>

        <ul className="mb-2 block ml-2.5">
          {archive.data.tags.map(tag =>
            <span className="mr-1.5">
              <Tag type={tag} key={tag}/>
            </span>
          )}
        </ul>
      </h1>

      <div className="block xl:flex">
        <section className="w-full xl:w-4/5 xl:pr-10">
          <div className="max-w-prose">
            <Preview content={readme.data}/>
          </div>
        </section>

        <section className="w-full xl:w-2/5 2xl:w-1/5">
          <div className="mb-1">
            <LikeButton likes={archive.data.likes} onLike={() => {
              mutation.mutate(id);
            }}/>
          </div>

          <FileBrowser initialData={files.data} archive={archive.data}/>
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
    const archive = await getArchive(id);
    if (context.query.id != getTitleUriFromArchive(archive))
      return {
        notFound: true
      };

    // const files = await fetcher("/archive/:id/store", { params: { id } }).then(f => f.body);
    // const readme: string = await fetch(`${ip}/api/archive/${id}/store/readme.md`).then(res => res.text());
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(["archive", id], () => archive);
    await queryClient.prefetchQuery(["file", id, "readme.md"], () => getFile(id, "readme.md"));
    await queryClient.prefetchQuery(["files", id], () => getFiles(id));
    const { cookie } = context.req.headers;
    await queryClient.prefetchQuery("user", () => getUser(cookie ? { cookie } : {}));

    return {
      props: { id, dehydratedState: dehydrate(queryClient) }
    }
  } catch (e) {
    return {
      notFound: true
    }
  }
}

export function getTitleUriFromArchive(archive: ApiResult<"/archive/:id">) {
  return `${archive.id}-${encodeURI(archive.title
    .toLowerCase()
    .replace(/( )|(%20)/g, "-"))}`;
}
