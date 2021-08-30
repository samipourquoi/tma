import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { createArchive, getUser, uploadFiles } from "../api";
import { dehydrate } from "react-query/hydration";
import { PageProps } from "./_app";
import { DefaultLayout } from "../layout/default-layout";
import { Editor } from "../components/editor";
import Head from "next/head";
import Router from "next/router";
import { getTitleUriFromArchive } from "./archive/[id]";
import { useUser } from "../hooks/use-user";
import { useEffect } from "react";

interface SubmitPageProps
  extends PageProps {}

export default function SubmitPage({}: SubmitPageProps) {
  const user = useUser();

  useEffect(() => {
    if (user.data == null) {
      Router.push("/api/auth/discord");
    }
  }, [user]);

  return (
    <DefaultLayout>
      <Head>
        <title>TMA - Submit</title>
      </Head>

      <h1 className="text-6xl">Submit</h1>

      <div className="mt-8">
        <Editor onSubmit={async (title, readme, tags, deleted, added) => {
          console.log(added, deleted);
          const archive = await createArchive(title, readme, tags);
          await uploadFiles(archive.baseID, added);
          await Router.push(`/archive/${getTitleUriFromArchive(archive)}`)
        }}/>
      </div>
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps<SubmitPageProps> = async ctx => {
  const queryClient = new QueryClient();
  const { cookie } = ctx.req.headers;
  await queryClient.prefetchQuery("user", () => getUser(cookie ? { cookie } : {}));

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}
