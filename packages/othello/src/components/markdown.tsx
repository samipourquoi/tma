import React, { useContext, useEffect, useState } from "react";
import marked from "marked";
import { SubmitCtx } from "../contexts";
import Monaco from "@monaco-editor/react";
import { tags, versions } from "../constants";

export const Preview: React.FC<{
  content: string
}> = ({ content }) => (
  // It's sanitized by `marked`
  <div className="markdown" dangerouslySetInnerHTML={{
    __html: marked(content, { sanitize: true })
  }}/>
);

// language=Markdown
const defaultReadme = `\
<!--
Welcome to TMA! 

In this file, write a description of your contraption.
You should mention:
 * how to use it;
 * performances;
 * versions with which it works;
 * credits;
 * (changelog, if needed).
Put as much detail as possible.
Try keeping history of your changes. Don't delete files from previous versions.
If you make a lot of changes to one of your contraption, you should probably submit
another post.
Avoid sharing world downloads, opt for litematics when possible.

To include an image you've uploaded named, for instance, \`hello_world.png\`,
use \`![alt](./hello_world.png)\`.

If you don't already know it, you should learn about markdown syntax:
 > https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
-->

# My cool contraption
## How to use
## Performances
## Versions
## Credits
`;

// language=yaml
const defaultMeta = `\
### In this file, write metadata about your contraption. 
###
### Although you probably don't need it, you can read about YAML syntax here:
###  > https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html

name: My cool contraption

# Uncomment the tags you need. These are commonly-used tags and it's best
# if you use them, but you can add custom tags if needed.
tags:
  - other
${tags
  .filter(tag => tag != "other")
  .map(tag => `#  - ${tag}`)
  .join("\n")}
    
# Same here.
versions:
  - any
${versions
  .filter(tag => tag != "any")
  .map(tag => `#  - ${tag}`)
  .join("\n")}
`;

export const Editor2: React.FC = () => {
  interface File { name: string, language: "markdown" | "json" | string, content: string }

  const [files, setFiles] = useState<File[]>([
    {
      name: "readme.md",
      language: "markdown",
      content: defaultReadme
    },
    {
      name: "meta.yml",
      language: "yaml",
      content: defaultMeta
    }
  ]);
  const [editableFile, setEditableFile] = useState(files[0]);

  return (
    <div>
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
        height="60vh"
        onChange={content => editableFile.content = content || editableFile.content}
        options={{
          mouseStyle: "text",
          minimap: { enabled: false }
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
