import dynamic from "next/dynamic";

const Markdown = dynamic(() => import("@uiw/react-markdown-preview/lib/esm/unstyled"), { ssr: false });
import { useState } from "react";

export interface MarkdownEditorProps {
  initialContent?: string
}

export default function MarkdownEditor({ initialContent = "" }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <Markdown source={content}/>
  )
}
