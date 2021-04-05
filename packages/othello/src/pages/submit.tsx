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

      <div className="block xl:flex mt-8">
        <section className="w-full xl:w-2/3 xl:mr-5">
          <Editor/>
        </section>

        <section className="w-full xl:w-1/3 mt-5 xl:mt-0">
          <FileUploader/>
        </section>
      </div>
    </Page>
  );
}
