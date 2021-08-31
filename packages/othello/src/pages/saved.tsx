import { PageProps } from "./_app";
import { GetServerSideProps } from "next";
import { getSaved, getUser } from "../api";
import { QueryClient, useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import { TableLayout } from "../layout/table-layout";
import { useEffect, useState } from "react";
import { PageSelector } from "../components/widgets/page-selector";
import { useUser } from "../hooks/use-user";
import Router from "next/router";
import Head from "next/head";

interface SavedPageProps extends PageProps {
}

export default function SavedPage({}: SavedPageProps) {
  const [page, setPage] = useState(1);
  const saved = useQuery(["saved", page], () => getSaved(page), { keepPreviousData: true });
  const user = useUser();

  useEffect(() => {
    if (user.data == null) {
      Router.push("/api/auth/discord");
    }
  }, [user]);

  return (
    <TableLayout
      archives={saved.data?.archives || []}
      total={saved.data?.total || 1}
      title={<>
        <Head>
          <title>TMA - Saved</title>
        </Head>

        <h1 className="text-6xl">Saved</h1>
        <p className="mt-4">Click on the heart
          when viewing an archive to save it and find it back here.</p>
      </>}
    />
  );
}

export const getServerSideProps: GetServerSideProps<SavedPageProps> = async ctx => {
  const { cookie } = ctx.req.headers;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("user", () => getUser(cookie ? { cookie } : {}));
  await queryClient.prefetchQuery(["saved", 1], () => getSaved(1,  cookie ? { cookie } : {}));

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}
