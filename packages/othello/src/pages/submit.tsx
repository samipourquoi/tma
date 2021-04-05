import { Page } from "../layout/page";
import { FileUploader } from "../components/file-uploader";
import React, { useState } from "react";
import { Editor } from "../components/markdown";
import { TagsSelector } from "../components/widgets/tags-selector";
import { tags as TAGS, versions as VERSIONS } from "../constants";
import { SubmitCtx } from "../contexts";
import { API } from "../api";
import Router from "next/router";
import { Content, Hierarchy } from "hamlet/api";
import fs from "fs";

interface SubmitPageProps {

}

export default function SubmitPage({}: SubmitPageProps) {
  const [title,    setTitle]    = useState("");
  const [tags,     setTags]     = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [readme,   setReadme]   = useState("");
  const [files,    setFiles]    = useState<Hierarchy>({});

  return (
    <Page>
      <SubmitCtx.Provider value={{
        setTags, setVersions, setReadme, setFiles
      }}>
        <h1 className="text-6xl">Submit</h1>

        <div className="block xl:flex mt-8">
          <section className="w-full xl:w-2/3 xl:mr-5 children:mb-8 text-gray-700">
            <div className="mb-4">
              <input placeholder="Title..." value={title} onChange={ev => {
                setTitle(ev.target.value);
              }} className="p-3 rounded-xl bg-gray-100 shadow text-2xl w-full placeholder-gray-400 text-gray-600"/>
            </div>

            <div className="mb-4">
              <h2 className="text-xl mb-3 text-gray-600 font-normal">Tags</h2>
              <TagsSelector availableTags={TAGS} name="tags"/>
            </div>

            <div>
              <h2 className="text-xl mb-3 text-gray-600 font-normal">Version</h2>
              <TagsSelector availableTags={VERSIONS} name="versions"/>
            </div>

            <div>
              <h2 className="text-xl mb-3 text-gray-600 font-normal">Readme</h2>
              <Editor/>
            </div>
          </section>

          <section className="w-full xl:w-1/3 mt-5 xl:mt-0">
            <FileUploader/>
          </section>
        </div>

        <button className="
          bg-tags-mob-farms px-4 py-2 rounded-xl text-gray-100 opacity-70
          transition-all duration-200 mt-8 xl:mt-0
          hover:opacity-100
        " onClick={() => {
          // I hate this piece of code, feel free to refactor it.

          const hierarchyToBase64 = (files: Hierarchy) => {
            for (const [name, data] of Object.entries(files)) {
              const getBase64 = () => btoa(new Uint8Array(data as ArrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), ""));

              if (typeof data == "string")
                files[name] = btoa(data);
              else if (data instanceof ArrayBuffer)
                files[name] = getBase64();
              else
                hierarchyToBase64(data);
            }
          }
          hierarchyToBase64(files);
          const filesBase64 = files as Hierarchy<string>;

          API.postArchive({
            title,
            readme,
            tags: tags.join(","),
            versions: versions.join(","),
            files: filesBase64
          }).then(() => {
            Router.push("/");
          });
        }}>
          Archive
        </button>
      </SubmitCtx.Provider>
    </Page>
  );
}
