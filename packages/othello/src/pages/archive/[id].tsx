import { DefaultLayout } from "../../layout/default-layout";
import React, { useMemo } from "react";
import { GetServerSideProps } from "next";
import { getArchive, getFile, getUser, likeArchive } from "../../api";
import Link from "next/link";
import { FileBrowser } from "../../components/file-browser";
import { Tag } from "../../components/tag";
import Head from "next/head";
import { LikeButton } from "../../components/like-button";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { PageProps } from "../_app";
import { dehydrate } from "react-query/hydration";
import { ArchiveAttributes } from "@tma/api/attributes";
import { convertFromRaw, EditorState } from "draft-js";
import { ReadonlyEditor } from "../../components/editor";

interface ArchiveViewProps extends PageProps {
  id: number
}

export default function ArchiveView({ id }: ArchiveViewProps) {
  const queryClient = useQueryClient();
  const archive = useQuery(["archive", id], () => getArchive(id));
  const readme = useQuery(
    ["file", id, "readme.json"],
    () => getFile(id, "readme.json")

  );
  const editor = useMemo(() => {
    if (!readme.data)
      return EditorState.createEmpty();
    const content = convertFromRaw(JSON.parse(readme.data as string));
    return EditorState.createWithContent(content);
  }, [readme]);

  const mutation = useMutation(likeArchive, {
    onSuccess: archive =>
      void queryClient.setQueryData(["archive", id], archive)
  });
  if (!archive.isSuccess || !readme.data)
    return null;

  return (
    <DefaultLayout>
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
            {/*<Preview content={readme.data}/>*/}
            <ReadonlyEditor state={editor}/>
          </div>
        </section>

        <section className="w-full xl:w-2/5 2xl:w-1/5">
          <div className="mb-1">
            <LikeButton likes={archive.data.likes} onLike={() => {
              mutation.mutate(id);
            }}/>
          </div>

          <FileBrowser archive={archive.data}/>
        </section>
      </div>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ArchiveViewProps> = async context => {
  try {
    const { id: paramID } = context.params!;
    let { commit } = context.query;

    if (!paramID)
      return { notFound: true };
    if (Array.isArray(commit))
      commit = commit[0];

    // Let an archive with ID #1 and title 'Birch farm'.
    // I want the uri for accessing it to be /archive/1-birch-farm,
    // and not something like /archive/1 (you obviously can't tell what the archive
    // is from the url if you don't include the title in it).
    //
    // However, you fetch an archive from the API with its ID.
    // So this checks if the URI is corresponding to the wanted format.
    const id = +(typeof paramID == "string" ?
      paramID.split("-")[0] :
      paramID);
    const archive = await getArchive(id, commit);
    if (context.query.id != getTitleUriFromArchive(archive))
      return {
        notFound: true
      };

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(["archive", id], () => archive);
    await queryClient.prefetchQuery(["file", id, "readme.json"], () => getFile(id, "readme.json"));
    await queryClient.prefetchQuery(["file", id, ""], () => getFile(id, ""));
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

export function getTitleUriFromArchive(archive: ArchiveAttributes) {
  return `${archive.baseID}-${encodeURI(archive.title
    .toLowerCase()
    .replace(/[ ?&]|(%20)/g, "-"))
    .replace(/-*$/, "")}`;
}
