import { PageProps } from "./_app";
import { DefaultLayout } from "../layout/default-layout";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { getUser } from "../api";
import { dehydrate } from "react-query/hydration";

interface SettingsPageProps extends PageProps {

}

export default function SettingsPage({}: SettingsPageProps) {
  return (
    <DefaultLayout>
      <h1 className="text-6xl">Settings</h1>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<SettingsPageProps> = async ctx => {
  const { cookie } = ctx.req.headers;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("user", () => getUser(cookie ? { cookie } : {}));

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}
