import React, { useRef, useState } from "react";

export const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);

  const updateFileList = () =>
    setFiles([...input.current?.files ?? []].map(file => file.name));

  return (
    <label className="block border border-dashed p-4 cursor-pointer rounded-xl">
      <input ref={input} className="hidden" type="file" name="files" multiple={true} onChange={updateFileList}/>
      <ul className="font-mono text-gray-600 text-base">
        {files.map(file => (
          <li className="flex align-middle group">
            <span className="ml-2">{file}</span>
          </li>
        ))}
      </ul>

      <p className={`text-center font-sans ${0 < files.length ? "mt-2" : ""}`}>
        Click to add new files
      </p>
    </label>
  );
}
