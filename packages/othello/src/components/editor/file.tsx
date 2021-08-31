import React, { useContext, useState } from "react";
import * as Icons from "phosphor-react";
import { ArchiveViewCtx, EditorCtx } from "../../contexts";
import { getFileUri } from "../../api";
import prettyBytes from "pretty-bytes";

export type EditorFileEntry =
  | { added: true, file: File }
  | { added: false, file: string };

export const FileDownload: React.FC<{
  name: string
}> = ({ name }) => {
  const { status } = useContext(EditorCtx);
  const archive = useContext(ArchiveViewCtx);

  const OptionalLink: React.FC = ({ children }) =>
    status == "viewing" && archive ? (
      <a className="no-markdown" download={name} href={getFileUri(archive, name)}>
        {children}
      </a>
    ) : <>{children}</>;

  return (
    <OptionalLink>
      <div className="
        inline-flex p-3 cursor-pointer my-2
        transition-all bg-main-beige hover:bg-main-dark-beige
        font-mono
      ">
          <div>
            <Icons.ArrowCircleDown size={40}/>
          </div>

          <div className="flex justify-center items-center text-xl ml-2">
            {name}
          </div>
      </div>
    </OptionalLink>
  );
}

export const SchematicDownload: React.FC<{
  file: File
}> = ({ file }) => {
  return null;
}

export const FilePopupCreation: React.FC<{
  onClose: () => void,
  onCreation: (file: File) => void
}> = ({ onClose, onCreation }) => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>();
  const [draggingFile, setDraggingFile] = useState(false);

  return (
    <div className="bg-contrast-300 bg-main-beige p-4 text-contrast-700">
      <div className="absolute top-3 right-3 cursor-pointer">
        <Icons.X size={18} onClick={() => onClose()}/>
      </div>

      {file ? (<>
        <label>
          <h4 className="font-sans font-normal">File name</h4>
          <input
            type="text"
            className="font-mono bg-main-dark-beige outline-none p-2 m-0 mb-4 w-full"
            value={fileName} onChange={ev => setFileName(ev.target.value)}
          />
        </label>

        <h4 className="font-sans font-normal">File size</h4>
        <div className="font-mono bg-main-dark-beige p-2 mb-4 cursor-not-allowed">
          {prettyBytes(file.size)}
        </div>
      </>) : null}

      <label>
        <h4 className="font-sans font-normal">File</h4>
        <div
          className={`font-sans bg-main-dark-beige w-full px-6 py-12
            flex justify-center items-center flex-wrap cursor-[copy]`}
          onDrop={ev => {
            ev.preventDefault();
            setFile(ev.dataTransfer.files.item(0));
          }}
          onDragOver={ev => ev.preventDefault()}
        >
          <div className="w-full flex justify-center">
            <Icons.ImageSquare className="inline" size={48}/>
          </div>
          <p className="mt-3">
            Drop a file here, or <span className="text-blue-700 hover:underline">browse</span>.
          </p>
        </div>

        <input
          type="file"
          className="hidden"
          onChange={ev => {
            const file: File | null = Array.from(ev.target.files ?? [])[0] ?? null;
            setFile(file);
            if (file && !fileName) {
              setFileName(file.name);
            }
          }}
        />
      </label>

      {fileName && file ? (
        <div className="mt-6">
          <button className="px-4 py-2 bg-main-green" onClick={() => {
            onClose();
            // onCreation({ ...file, name: fileName });
            onCreation(Object.defineProperty(file, "name", {
              writable: true,
              value: fileName
            }));
          }}>
            Upload
          </button>
        </div>
      ) : null}
    </div>
  );
}
