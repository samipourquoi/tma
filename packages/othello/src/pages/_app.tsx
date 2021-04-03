
// import '@uiw/react-md-editor/dist/markdown-editor.css'
// import "@uiw/react-markdown-preview/dist/markdown.css";

import "../styles/imports.scss";
import '../styles/index.scss'
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps}/>
  );
}
