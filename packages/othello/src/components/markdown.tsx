import React, { useContext, useEffect, useState } from "react";
import marked from "marked";
import Monaco, { useMonaco } from "@monaco-editor/react";
import { tags, versions } from "../constants";
import { useDarkMode } from "../hooks/use-dark-mode";
import * as YAML from "yaml";

export const Preview: React.FC<{
  content: string
}> = ({ content }) => (
  // It's sanitized by `marked`
  <div className="markdown" dangerouslySetInnerHTML={{
    __html: marked(content, { sanitize: true })
  }}/>
);

const defaultReadme = `\
# Welcome to TMA!
In this file, write a description of your contraption.
You should mention:
 * how to use it;
 * performances;
 * drops;
 * versions with which it works;
 * credits;
 * (changelog, if needed).
 
Put as much detail as possible.
Try keeping history of your changes. Don't delete files from previous versions.
If you make a lot of changes to one of your contraption, you should probably submit
another post.
Avoid sharing world downloads, opt for litematics when possible.

Don't forget to delete this part before publishing.

If you don't already know it, you should learn about 
markdown syntax [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
`;

const defaultMeta = `\
### In this file, write metadata about your contraption. 
###
### Although you probably don't need it, you can read about YAML syntax here:
###  > https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html

title: My cool contraption

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
  .map(tag => `#  - "${tag}"`)
  .join("\n")}
`;

export const Editor2: React.FC = () => {
  interface File {
    name: string,
    language: "markdown" | "json" | string,
    content: string
  }

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
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const editableFile = files[currentFileIndex];
  const [dark] = useDarkMode();
  const monaco = useMonaco();

  useEffect(() => {
    monaco?.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#2b2b2b"
      }
    });
  }, [monaco]);

  useEffect(() => {
    setFiles(files); // to rerender the component
  }, [dark])

  return (
    <div>
      <div className="flex w-full">
        { files.map((file, i) => {
          let content = "";
          if (file.language == "yaml") {
            try {
              content = JSON.stringify(YAML.parse(file.content));
            } catch (e) {
              content = ""
            }
          } else {
            content = file.content;
          }
          return (
            <div key={ i }>
              <textarea name={ file.name } value={content} hidden/>
              <button
                type="button"
                className={ `font-mono mx-2 my-1 
            ${ i == currentFileIndex ? "text-gray-600" : "text-gray-400 hover:text-gray-500" }` }
                onClick={ () => {
                  setCurrentFileIndex(i);
                } }>
                { file.name }</button>
            </div>
          );
        }) }
      </div>

      <Monaco
        language={ editableFile.language }
        value={ editableFile.content }
        theme={dark ? "dark" : "light"}
        height="60vh"
        onChange={content => {
          setFiles(files.map(f => f == editableFile ? { ...editableFile, content: content || "" } : f));
        }}
        options={{
          mouseStyle: "text",
          minimap: { enabled: false },
          wordWrap: "on"
        } }/>
    </div>
  );
}
