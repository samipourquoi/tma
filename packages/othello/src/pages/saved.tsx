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
    <TableLayout rows={saved.data?.archives || []}>
      <h1 className="text-6xl">Saved</h1>

      <div className="flex justify-end mt-2">
        <PageSelector pageAmount={saved.data?.total || 1} page={page} setPage={setPage}/>
      </div>
    </TableLayout>
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
