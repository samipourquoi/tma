import { Page } from "../layout/page";
import { FileUploader } from "../components/file-uploader";
import React from "react";
import { Editor } from "../components/markdown";

interface SubmitPageProps {

}

export default function SubmitPage({}: SubmitPageProps) {
  return (
    <Page>
      <h1 className="text-6xl">Submit</h1>

      <div className="block lg:flex mt-8 h-full">
        <section className="w-full lg:w-1/2 mr-5">
          <Editor/>
        </section>

        <section className="w-full lg:w-3/5 lg:w-1/2">
          <FileUploader/>
        </section>
      </div>
    </Page>
  );
}
