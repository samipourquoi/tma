import React, { useContext, useEffect, useState } from "react";
import marked from "marked";
import { SubmitCtx } from "../contexts";

export const Preview: React.FC<{
  content: string
}> = ({ content }) => (
  // It's sanitized by `marked`
  <div className="markdown" dangerouslySetInnerHTML={{
    __html: marked(content, { sanitize: true })
  }}/>
);

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
