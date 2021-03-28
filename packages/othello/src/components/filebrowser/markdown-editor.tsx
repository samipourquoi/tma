import { useState } from "react";
import dynamic from "next/dynamic";

// PLEASE DON'T LOOK AT THIS, IT'S HORRIBLE AND
// I DON'T KNOW HOW TO FIX THIS SHIT
const MarkdownPreview = dynamic(
  // @ts-ignore
  () => import("@uiw/react-markdown-preview/lib/esm/unstyled").then(mod => mod.default),
  { ssr: false }
) as any;


export interface MarkdownEditorProps {
  initialContent?: string
}

export default function MarkdownEditor({ initialContent = "" }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <MarkdownPreview source={content}/>
  )
}
