import React, { useContext, useEffect, useState } from "react";
import marked from "marked";
import { SubmitCtx } from "../contexts";
import Monaco from "@monaco-editor/react";

export const Preview: React.FC<{
  content: string
}> = ({ content }) => (
  // It's sanitized by `marked`
  <div className="markdown" dangerouslySetInnerHTML={{
    __html: marked(content, { sanitize: true })
  }}/>
);

export const Editor2: React.FC = () => {
  interface File { name: string, language: "markdown" | "json" | string, content: string }

  const [files, setFiles] = useState<File[]>([
    {
      name: "readme.md",
      language: "markdown",
      content: "## Hello world\n"
    },
    {
      name: "meta.json",
      language: "json",
      content: "{\n\t\n}"
    }
  ]);
  const [editableFile, setEditableFile] = useState(files[0]);

  return (
    <div className="h-screen">
      <div className="flex w-full">
        {files.map(file => (
          <button
            key={file.name}
            className={`font-mono mx-2 my-1 
              ${file.name == editableFile.name ? "text-gray-600": "text-gray-400 hover:text-gray-500"}`}
            onClick={() => {
              setEditableFile(file)
            }}>
            {file.name}</button>
        ))}
      </div>

      <Monaco
        language={editableFile.language}
        value={editableFile.content}
        theme="light"
        onChange={content => editableFile.content = content || editableFile.content}
        options={{
          mouseStyle: "text"
        }}/>
    </div>
  );
}

export const Editor: React.FC = () => {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [content, setContent] = useState(
    "# My cool Minecraft contraption 😎\n\n" +
    "## How to use\n\n" +
    "## Performances\n\n" +
    "## Version compatibility\n\n" +
    "## Credits");

  const { setReadme } = useContext(SubmitCtx);
  useEffect(() => {
    setReadme(content);
  }, [content]);

  return (
    <div className="border border-dashed rounded-xl">

      <div className="text-gray-700 px-4 py-2 flex border-b">
        <span className="material-icons cursor-pointer" onClick={() => setMode("edit")}>
          edit
        </span>
        <span className="material-icons ml-3 cursor-pointer" onClick={() => setMode("preview")}>
          remove_red_eye
        </span>
      </div>

      <div className="w-full p-4">
        {mode == "edit" ? (
          <textarea className="
            resize w-full max-w-full h-[35vh] rounded-xl p-1
            text-gray-700
          " onChange={ev => setContent(ev.target.value)}
            value={content}/>
        ) : (
          <Preview content={content}/>
        )}
      </div>
    </div>
  );
}
