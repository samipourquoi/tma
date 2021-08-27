declare module "draft-js-markdown-shortcuts-plugin" {
  import { EditorPlugin } from "@draft-js-plugins/editor";
  const createMarkdownShortcutsPlugin: (config?: any) => EditorPlugin;
  export default createMarkdownShortcutsPlugin;
}

declare module "react-animated-heart" {
  import React from "react";
  const Heart: React.FC<{
    isClick: boolean,
    onClick: () => void
  }>;
  export default Heart;
}
