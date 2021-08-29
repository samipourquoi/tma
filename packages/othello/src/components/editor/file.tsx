import React, { useContext, useState } from "react";
import * as Icons from "phosphor-react";
import { ArchiveViewCtx, EditorCtx } from "../../contexts";
import { getFileUri } from "../../api";

export const FileDownload: React.FC<{
  name: string
}> = ({ name }) => {
  const { editing } = useContext(EditorCtx);
  const archive = useContext(ArchiveViewCtx);

  const OptionalLink: React.FC = ({ children }) =>
    !editing && archive ? (
      <a className="no-markdown" download href={getFileUri(archive, name)}>
        {children}
      </a>
    ) : <>{children}</>;


  return (
    <OptionalLink>
      <div className="
        inline-flex rounded-lg p-3 cursor-pointer my-2
        transition-all hover:shadow-lg bg-green-400 text-green-600 border-green-600
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

  return (
    <div className="bg-contrast-300 p-4 rounded text-contrast-700">
      <div className="flex justify-end">
        <Icons.X size={18} onClick={() => onClose()}/>
      </div>

      <label>
        <h4>File name</h4>
        <input
          type="text"
          className="font-mono bg-contrast-400 outline-none p-2 rounded"
          value={fileName} onChange={ev => setFileName(ev.target.value)}
        />
      </label>

      <label>
        <h4 className="mt-4">File</h4>
        <input
          type="file"
          className="font-mono bg-contrast-400 outline-none p-2 rounded"
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
        <div className="mt-4">
          <button className="click-button px-2 py-1 rounded" onClick={() => {
            onClose();
            onCreation({ ...file, name: fileName });
          }}>
            Upload
          </button>
        </div>
      ) : null}
    </div>
  );
}
