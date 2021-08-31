import { PageProps } from "./_app";
import { DefaultLayout } from "../layout/default-layout";
import { GetServerSideProps } from "next";
import { QueryClient, useMutation, useQuery } from "react-query";
import { getUser, updatePassword } from "../api";
import { dehydrate } from "react-query/hydration";
import React, { useEffect, useState } from "react";
import { useUser } from "../hooks/use-user";
import Router from "next/router";

interface SettingsPageProps extends PageProps {

}

export default function SettingsPage({}: SettingsPageProps) {
  const user = useUser();
  const [password, setPassword] = useState("");
  const ftpPasswordMutation = useMutation(updatePassword);

  useEffect(() => {
    if (user.data == null) {
      Router.push("/api/auth/discord");
    }
  }, [user]);

  return (
    <DefaultLayout title={<h1 className="text-6xl">Settings</h1>}>
      <section className="text-contrast-700 mt-5">
        <h2 className="text-3xl my-3 text-contrast-800">FTP</h2>
        <p className="font-light text-base">
          You can login via FTP to edit and retrieve files from the archive. To do so,
          download a FTP client, and connect to <pre className="inline text-contrast-700">tmc-archive.org</pre> with
          the default port. The username is the same as your discord account, and the password is
          what you will enter in this section.</p>

        <label className="m-2">
          <h4 className="">FTP Password</h4>
          <input
            className="mt-2 p-3 bg-contrast-400 rounded outline-none font-helvetica"
            type="text" value={password}
            onChange={ev => setPassword(ev.target.value)}/>
        </label>
      </section>

      <section className="text-contrast-700 mt-10">
        <h2 className="text-3xl text-contrast-800 my-3">Webhooks</h2>
        <p className="font-light text-base">
          In the future, you will be able to create discord webhooks to post new archive entries on your
          discord server. In the mean time, just ask <pre className="inline text-contrast-700">samipourquoi#9267</pre>.</p>
      </section>

      <button type="submit" className="click-button mt-8" onClick={() => {
        ftpPasswordMutation.mutate(password);
        setPassword("");
      }}>
        Save
      </button>
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
