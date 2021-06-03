import { Page } from "../layout/page";
import { FileUploader } from "../components/file-uploader";
import React, { useEffect } from "react";
import { Editor2 } from "../components/markdown";
import Router from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { PageProps } from "./_app";
import { getUser } from "../api";
import { dehydrate } from "react-query/hydration";
import { useUser } from "../hooks/use-user";

interface SubmitPageProps extends PageProps {

}

export default function SubmitPage({}: SubmitPageProps) {
  const user = useUser();

  useEffect(() => {
    if (user.data == null) {
      Router.push("/api/auth/discord");
    }
  }, [user]);

  return (
    <Page>
      <Head>
        <title>TMA - Submit</title>
      </Head>

      <h1 className="text-6xl">Submit</h1>

      <form encType="multipart/form-data" action="/api/archive" method="POST">
        <div className="block xl:flex mt-8">
          <section className="w-full xl:w-2/3 xl:mr-5 children:mb-8 text-gray-700">
            <Editor2/>
          </section>

          <section className="w-full xl:w-1/3 mt-5 xl:mt-0">
            <FileUploader/>
          </section>
        </div>

        <button type="submit" className="
          click-button px-4 py-2 rounded-xl
          transition-all duration-200 mt-8 xl:mt-0
        ">
          Archive
        </button>
      </form>
    </Page>
  );
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
