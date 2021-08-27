import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { getUser } from "../api";
import { dehydrate } from "react-query/hydration";
import { PageProps } from "./_app";
import { DefaultLayout } from "../layout/default-layout";
import { Editor3 } from "../components/editor";
import { Head } from "next/document";

interface SubmitPageProps
  extends PageProps {}

export default function _SubmitPage() {
  return (
    <DefaultLayout>
      <h1 className="text-6xl">Submit</h1>

      <div className="mt-8">
        <Editor3/>
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
