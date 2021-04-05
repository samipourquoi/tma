import { Page } from "../layout/page";
import { FileUploader } from "../components/file-uploader";
import React from "react";
import { Editor } from "../components/markdown";
import { TagsSelector } from "../components/widgets/tags-selector";
import { tags, versions } from "../constants";

interface SubmitPageProps {

}

export default function SubmitPage({}: SubmitPageProps) {
  return (
    <Page>
      <h1 className="text-6xl">Submit</h1>

      <div className="block xl:flex mt-8">
        <section className="w-full xl:w-2/3 xl:mr-5 children:mb-8">
          <div className="mb-4">
            <h2 className="text-xl mb-3">Tags</h2>
            <TagsSelector availableTags={tags}/>
          </div>

          <div>
            <h2 className="text-xl mb-3">Version</h2>
            <TagsSelector availableTags={versions}/>
          </div>

          <div>
            <h2 className="text-xl mb-3">Readme</h2>
            <Editor/>
          </div>
        </section>

        <section className="w-full xl:w-1/3 mt-5 xl:mt-0">
          <FileUploader/>
        </section>
      </div>
    </Page>
  );
}
