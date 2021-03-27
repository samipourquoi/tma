import { useState } from "react";
import useSWR from "swr";
import { GET_ArchiveFilesResult, GET_ArchiveResult } from "hamlet/api";
import { arch } from "os";
import { fetcher } from "../../api";

export interface FileBrowserProps {
  initialData: string[],
  archive: GET_ArchiveResult
}

// These are just copy pasted from Github... (they look cool though)
const dirSVG = (
  <svg aria-label="Directory" height="16" viewBox="0 0 16 16" version="1.1" width="16" role="img">
    <path fillRule="evenodd"
      d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0
      0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z"/>
  </svg>
);

const fileSVG = (
  <svg aria-label="File" height="16" viewBox="0 0 16 16" version="1.1" width="16" role="img">
    <path fillRule="evenodd"
      d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018
      4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184
      1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z"/>
  </svg>
);

export default function FileBrowser({ initialData, archive }: FileBrowserProps) {
  // This is kinda messy but meh it works.

  const rootPath = "";
  const [currentFolder, setCurrentFolder] = useState(rootPath);
  const { data = [] } = useSWR<GET_ArchiveFilesResult>(
    `/api/archive/store/${archive.id}${currentFolder}`,
    fetcher,
    { initialData }
  );
  const entries = currentFolder == rootPath ? data : ["../", ...data];
  const isDir = (file: string) => file.endsWith("/");
  const dirs = entries.filter(isDir);
  const files = entries.filter(file => !isDir(file));

  return (
    <div className="file-browser">
      <h3>{currentFolder == rootPath ? "/" : currentFolder}</h3>
      <div className="entries">
        {dirs.map(dir => (
          <div className="directory" onClick={() => {
            if (dir == "../") {
              const a = currentFolder.split("/");
              a.pop();
              a.pop();
              setCurrentFolder(a.join("/"))
            } else {
              setCurrentFolder(`${currentFolder}/${dir}`)
            }
          }}>
            <span className="entry-icon">
              {dirSVG}
            </span>
            <span className="entry-name">
              {dir.slice(0,-1)}
            </span>
          </div>
        ))}

        {files.map(file => (
          <div className="file">
            <span className="entry-icon">
              {fileSVG}
            </span>
            <span className="entry-name">
              {file}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
