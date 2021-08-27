import React, { useEffect, useMemo, useState } from "react";
import { ContentBlock, ContentState, EditorState, genKey, Modifier, SelectionState, EditorBlock } from "draft-js";
import dynamic from "next/dynamic";
import type { PluginEditorProps } from "@draft-js-plugins/editor";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";
import * as Immutable from "immutable";
import buttonStyles from "../styles/editor/button.module.scss";
import toolbarStyles from "../styles/editor/toolbar.module.scss";
import { TagType } from "@tma/api";
import { CustomTag, Tag, TagsSelector2 } from "./tag";
import { TAGS } from "../constants";
import { TagsSelector } from "./widgets/tags-selector";

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
        // editable: true,
        props: {}
      };
  }
}

const enforceTitle = (state: EditorState): EditorState => {
  let content = state.getCurrentContent();
  let blocks = content.getBlockMap();

  // Always put a title at the top
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

  // Coerces the second block to a paragraph.
  // At the same time, prevents duplicating the title.
  blocks = content.getBlockMap();
  const secondBlockKey: string | undefined = blocks.keySeq().get(1);
  if (secondBlockKey) {
    const secondBlock = blocks.get(secondBlockKey);
    const secondBlockCoerced = secondBlock.set("type", "paragraph");
    blocks = blocks.set(secondBlockKey, secondBlockCoerced as ContentBlock);
    content = content.set("blockMap", blocks) as ContentState;
  }

  return EditorState.set(state, {
    currentContent: content
  });
}

const toolbarPlugin = createToolbarPlugin({
  theme: { buttonStyles, toolbarStyles }
});
const { Toolbar } = toolbarPlugin;

export const Editor3: React.FC = () => {
  const [tags, setTags] = useState<Set<TagType>>(new Set);
  const [state, setState] = useState(() => EditorState.createEmpty());
  const plugins = useMemo(() => [
    createMarkdownShortcutsPlugin(),
    toolbarPlugin
  ], []);

  const onChange = (newState: EditorState) => {
    newState = enforceTitle(newState);
    setState(newState);
  }

  return (
    <div>
      <TagsSelector2 tags={tags} setTags={setTags}/>

      <div className="mt-4 px-4 pt-2 markdown editor color-contrast-700">
        <div className="sticky -top-12 px-6 border-b border-contrast-500 bg-contrast-300">
          <Toolbar/>
        </div>

        <DraftEditor
          editorState={state}
          onChange={onChange}
          plugins={plugins}
          spellCheck
          blockStyleFn={styling}
          blockRendererFn={render}
          // readOnly={true}
        />
      </div>
    </div>
  );
}
