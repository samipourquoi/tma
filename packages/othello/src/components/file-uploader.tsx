import React, { createContext, useContext, useEffect, useState } from "react";
import { dirSVG, fileSVG } from "./file-browser";
import { Preview } from "./markdown";
import { types } from "util";
import { SubmitCtx } from "../contexts";
import { Content, Hierarchy } from "hamlet/api";

const isHierarchy = (x => typeof x != "string" && !(x instanceof ArrayBuffer)) as
  (x: Hierarchy | Content) => x is Hierarchy;

const ctx = createContext<{
  files: Hierarchy,
  setFiles(files: Hierarchy): void,
  setEditorContent(content: React.ReactNode): void
}>(null as any);

export const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<Hierarchy>({
    "readme.md":
      "Drag and drop new files!\n\n" +
      "You can also, once submitted, connect via FTP for easier file management.\n\n" +
      "The markdown content you are writing will replace this file.",
    "meta.yml": ""
  });

  const [content, setContent] = useState<React.ReactNode>("");
  const setEditorContent = (content: React.ReactNode) => {
    if (typeof content == "string") {
      const newContent = content.split("\n")
        .reduce((text, line) => (
          <>
            {text}
            {line}<br/>
          </>
        ), <></>);
      setContent(newContent);
    } else {
      setContent(content);
    }
  };

  useEffect(() => {
    setEditorContent(files["readme.md"]);
  }, []);

  const { setFiles: setFilesSubmit } = useContext(SubmitCtx);

  useEffect(() => {
    setFilesSubmit(files);
  }, [files])

  return (
    <ctx.Provider value={{
      files, setFiles, setEditorContent
    }}>
      <div className="border border-dashed p-4 rounded-xl flex flex-col font-mono">
        <ul className="w-full select-none text-gray-600 break-words">
          <FileHierarchy files={files} setFiles={setFiles}/>
        </ul>
        <div className="
          w-full border-t border-gray-300 pl-3 overflow-auto
          flex justify-center items-center w-full pt-4 mt-4
          text-gray-700
        ">
          {content}
        </div>
      </div>
    </ctx.Provider>
  );
}

const FileHierarchy: React.FC<{
  files: Hierarchy,
  setFiles(files: Hierarchy): void
}> = ({ files, setFiles }) => {
  const [isDraggedOver, setDraggedOver] = useState(false);
  const { setEditorContent } = useContext(ctx);

  return (
    <div onDragEnter={ev => {
      ev.stopPropagation();
      setDraggedOver(!isDraggedOver);
    }} onDragLeave={ev => {
      ev.stopPropagation();
      setDraggedOver(!isDraggedOver);
    }} onDrop={ev => {
      (async () => {
        try {
          const entries = await Promise.all(
            Array.from(ev.dataTransfer.files)
              .map(async file => ({ [file.name]: await file.arrayBuffer() }))
          );

          const newEntries = entries.reduce((previous, entry) => {
            return { ...previous, ...entry };
          }, files);

          setFiles(newEntries);
          setEditorContent("");
        } catch {

        }
      })();

      ev.preventDefault();
      ev.stopPropagation();
      setDraggedOver(false);
    }} onDragOver={ev => {
      // Necessary because of https://stackoverflow.com/questions/50230048/react-ondrop-is-not-firing.
      ev.preventDefault();
    }} className={`p-1 rounded-xl ${isDraggedOver ? "bg-gray-100" : ""} children:mt-2`}>
      {Object.entries(files).map(([name, content]) =>
        isHierarchy(content) ?
          <Directory key={name} name={name} files={content} setFiles={newFiles => {
            setFiles({ ...files, [name]: newFiles });
          }}/> :
          <File key={name} name={name} content={content}/>
      )}
    </div>
  );
}

const Directory: React.FC<{
  name: string,
  files: Hierarchy,
  setFiles(files: Hierarchy): void
}> = ({ name, files, setFiles }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <li>
      <div className="flex items-center" onClick={() => setOpen(!isOpen)}>
        <span className="fill-current">
          {dirSVG}
        </span>
        <span className="ml-2 hover:underline cursor-pointer">
          {name}
        </span>
      </div>


      {isOpen ? (
        <ul className="pl-4">
          <FileHierarchy files={files} setFiles={setFiles}/>
        </ul>
      ) : null}
    </li>
  );
}

const File: React.FC<{
  name: string,
  content: Content
}> = ({ name, content }) => {
  const { setEditorContent } = useContext(ctx);

  return (
    <li className="flex items-center">
      <span className="fill-current">
        {fileSVG}
      </span>
      <span className="ml-2 hover:underline cursor-pointer" onClick={() => {
        const show = (() => {
          const extension = name.split(".").pop();

          // https://stackoverflow.com/questions/49123222/converting-array-buffer-to-string-maximum-call-stack-size-exceeded
          const getBase64 = () => btoa(new Uint8Array(content as ArrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), ""));

          switch (extension) {
            case "png":
            case "jpg":
            case "jpeg":
              return <img src={`data:image/${extension};base64, ${getBase64()}`} alt="Image preview"/>;
            case "mp4":
            case "mov":
              return <video src={`data:video/${extension};base64, ${getBase64()}`}/>;

            default:
              return content instanceof ArrayBuffer ?
                new TextDecoder("utf-8").decode(content) :
                content;
          }
        })();

        setEditorContent(show);
      }}>
        {name}
      </span>
    </li>
  );
}
