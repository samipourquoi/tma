import { useState } from "react";

export interface FileUploaderProps {
  onNewFile?: (file: File) => void
}

export default function FileUploader(props: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const hasFiles = files.length == 0;

  return (
    <div className="file-uploader">
      <label className="drop-zone"
        style={{ borderBottom: hasFiles ? "none" : "" }}>
        <input type="file" name="files" multiple onChange={ev => {
          setFiles(Array.from(ev.target.files!));
        }}/>

        <p>
          Drag and Drop files<br/>
          {files.length == 0 ?
            "no entries" :
            `${files.length} entries`}
        </p>
      </label>

      <ul className="entries" style={{ display: hasFiles ? "none": "" }}>
        {files.map((file, i) => (
          <li className="entry" key={i}>
            <span className="material-icons clear" onClick={() => {
              const newFiles = [...files];
              newFiles.splice(i, 1);
              setFiles(newFiles);
            }}>
              clear
            </span>
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
