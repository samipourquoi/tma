import '../styles/index.scss'
import { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="manifest" href="/manifest.json"/>
        <title>TMA</title>
      </Head>
      <Component { ...pageProps }/>
    </>
  );
}
