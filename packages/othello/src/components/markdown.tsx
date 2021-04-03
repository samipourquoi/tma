import React from "react";
import marked from "marked";

export const Preview: React.FC<{
  content: string
}> = ({ content }) => (
  // It's sanitized by `marked`
  <div className="markdown" dangerouslySetInnerHTML={{
    __html: marked(content, { sanitize: true })
  }}/>
)
