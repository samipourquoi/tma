import React, { useEffect, useMemo, useState } from "react";
import { ContentBlock, ContentState, EditorState, genKey, Modifier, SelectionState, EditorBlock } from "draft-js";
import dynamic from "next/dynamic";
import type { PluginEditorProps } from "@draft-js-plugins/editor";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";
import * as Immutable from "immutable";

const DraftEditor: React.FC<PluginEditorProps> = dynamic(
  () => import("@draft-js-plugins/editor").then(draftjs => draftjs.default) as any,
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
) as any;

const styling = (block: ContentBlock) => {
  switch (block.getType()) {
    case "header-one": return "h1";
    case "header-two": return "h2";
    case "header-three": return "h3";
    case "header-four": return "h4";
    case "header-five": return "h5";
    case "header-six": return "h6";
    case "title-placeholder": return ""
    default: return "";
  }
}

const render = (block: ContentBlock) => {
  switch (block.getType()) {
    case "title-placeholder":
      return {
        component: (props: any) => (
          <h1 className={block.getText() == "" ? "show-placeholder" : ""}>
            <EditorBlock {...props}/>
          </h1>
        ),
        editable: true,
        props: {}
      };
  }
}

const hasMoreThanTwoTitles = (state: EditorState): boolean => {
  let content = state.getCurrentContent();
  let blocks = content.getBlockMap();
  let titlePlaceholders = blocks.filter(block => (block as ContentBlock).getType() == "title-placeholder");
  return 1 < titlePlaceholders.size;
}

const enforceTitle = (state: EditorState): EditorState => {
  let content = state.getCurrentContent();
  let blocks = content.getBlockMap();

  const title = content.getFirstBlock();
  if (title.getType() != "title-placeholder" || title.isEmpty()) {
    const placeholder = "";
    const key = genKey();
    const title = new ContentBlock({
      key,
      text: placeholder,
      type: "title-placeholder"
    });
    const blocks2 = Immutable.OrderedMap().set(key, title).concat(blocks);
    content = content.set("blockMap", blocks2) as ContentState;
  }

  return EditorState.set(state, {
    currentContent: content
  });
}

export const Editor3: React.FC = () => {
  const [state, setState] = useState(() => EditorState.createEmpty());
  const plugins = useMemo(() => [
    createMarkdownShortcutsPlugin()
  ], []);

  const onChange = (newState: EditorState) => {
    // if (hasMoreThanTwoTitles(newState))
    //   return;
    newState = enforceTitle(newState);
    setState(newState);
  }

  useEffect(() => {
  }, [state])

  return (
    <div className="border p-4 markdown">
      <DraftEditor
        editorState={state}
        onChange={onChange}
        plugins={plugins}
        spellCheck
        blockStyleFn={styling}
        blockRendererFn={render}
      />
    </div>
  )
}
