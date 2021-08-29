import React, { useContext, useMemo, useState } from "react";
import {
  AtomicBlockUtils,
  ContentBlock,
  ContentState,
  convertToRaw,
  EditorBlock,
  EditorState,
  genKey,
  Modifier,
  RawDraftContentState
} from "draft-js";
import dynamic from "next/dynamic";
import type { PluginEditorProps } from "@draft-js-plugins/editor";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";
import * as Immutable from "immutable";
import { TagType } from "@tma/api";
import { TagsSelector2 } from "../tag";
import * as Icons from "phosphor-react";
import { IconProps } from "phosphor-react";
import Popup from "reactjs-popup";
import { FileDownload, FilePopupCreation, SchematicDownload } from "./file";
import { EditorCtx } from "../../contexts";

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

// https://draftjs.org/docs/advanced-topics-block-components
const CustomBlockRender: React.FC<{
  block: ContentBlock,
  contentState: ContentState,
  blockProps: Record<string, unknown>
}> = ({ block, contentState , blockProps }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data: Record<string, unknown> = entity.getData();
  const type = entity.getType();

  if (type == "FILE-DOWNLOAD:FILE") {
    const name = data.name as string;
    return <FileDownload name={name}/>
  } else {
    return null;
  }
}

const render = (block: ContentBlock) => {
  if (block.getType() == "atomic")
    return {
      component: CustomBlockRender,
      props: {},
      editable: false
    };

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
    const key = genKey();
    const title = new ContentBlock({
      key,
      text: "",
      type: "title-placeholder"
    });
    const blocks2 = Immutable.OrderedMap().set(key, title).concat(blocks);
    content = content.set("blockMap", blocks2) as ContentState;
  }

  // Coerces the second block to a paragraph if it is a title-placeholder.
  blocks = content.getBlockMap();
  const secondBlockKey: string | undefined = blocks.keySeq().get(1);
  if (secondBlockKey) {
    const secondBlock = blocks.get(secondBlockKey);
    if (secondBlock.getType() == "title-placeholder") {
      const secondBlockCoerced = secondBlock.set("type", "paragraph");
      blocks = blocks.set(secondBlockKey, secondBlockCoerced as ContentBlock);
      content = content.set("blockMap", blocks) as ContentState;
    }
  }

  return EditorState.set(state, {
    currentContent: content
  });
}

const plugins = [
  createMarkdownShortcutsPlugin(),
];

const ToolbarItem: React.FC<{
  icon: React.FC<IconProps>,
  onToggle: (activated: boolean) => void,
  toggleable?: boolean
}> = ({ icon: Icon, onToggle, toggleable = true }) => {
  const [activated, setActivated] = useState(false);

  return (
    <Icon
      color={activated && toggleable ? "blue" : "var(--cl-contrast-600)"}
      className="cursor-pointer"
      onMouseDown={ev => ev.preventDefault()}
      onClick={() => {
        setActivated(!activated);
        onToggle(!activated);
      }}
      size={26}
    />
  );
};

const Toolbar: React.FC<{
  state: EditorState,
  setState: (state: EditorState) => void
}> = ({ state, setState }) => {
  const [filePopup, setFilePopup] = useState<"file" | "schematic" | null>(null);
  const { files: [files, setFiles] = [] } = useContext(EditorCtx);

  // https://github.com/webdeveloperpr/draft-js-custom-styles/issues/3
  const toggleStyle = (style: string) => (toggle: boolean) => {
    const selection = state.getSelection();
    const currentStyle = state.getCurrentInlineStyle();
    if (selection.isCollapsed())
      return setState(
        EditorState.setInlineStyleOverride(state, toggle ?
          currentStyle.add(style) :
          currentStyle.remove(style))
      );

    const content = state.getCurrentContent();
    const newContent = toggle ?
      Modifier.applyInlineStyle(content, selection, style) :
      Modifier.removeInlineStyle(content, selection, style)

    setState(
      EditorState.push(state, newContent, 'change-inline-style')
    );
  };

  return (
    <div className="py-3 border-b border-contrast-500 bg-contrast-300 flex">
      <div className="flex px-2">
        <ToolbarItem icon={Icons.TextBolder} onToggle={toggleStyle("BOLD")}/>
        <ToolbarItem icon={Icons.TextItalic} onToggle={toggleStyle("ITALIC")}/>
        <ToolbarItem icon={Icons.TextUnderline} onToggle={toggleStyle("UNDERLINE")}/>
        <ToolbarItem icon={Icons.TextStrikethrough} onToggle={toggleStyle("STRIKETHROUGH")}/>
      </div>
      <div className="flex px-2 border-l border-contrast-500">
        <ToolbarItem icon={Icons.FileArrowUp} toggleable={false} onToggle={() => {
          setFilePopup("file");
        }}/>
        <Popup
          overlayStyle={{ background: "rgba(0, 0, 0, .6)" }}
          open={filePopup != null}
          onClose={() => setFilePopup(null)}
        >
          <FilePopupCreation
            onClose={() => setFilePopup(null)}
            onCreation={file => {
              setFiles!(new Set([ ...files!, file ]));

              // https://github.com/facebook/draft-js/issues/543
              const content = state.getCurrentContent();
              const contentWithEntity = content.createEntity(
                `FILE-DOWNLOAD:${filePopup?.toUpperCase()}`,
                "IMMUTABLE",
                { name: file.name }
              );
              const entityKey = contentWithEntity.getLastCreatedEntityKey();
              const stateWithEntity = EditorState.set(state, { currentContent: contentWithEntity });
              setState(
                AtomicBlockUtils.insertAtomicBlock(stateWithEntity, entityKey, " ")
              );
            }}
          />
        </Popup>
      </div>
    </div>
  );
}

export const Editor: React.FC<{
  onSubmit: (
    title: string,
    readme: RawDraftContentState,
    tags: TagType[]
  ) => void
}> = ({ onSubmit }) => {
  const [tags, setTags] = useState<Set<TagType>>(new Set);
  const [state, setState] = useState(() => EditorState.createEmpty());
  const [files, setFiles] = useState<Set<File>>(new Set);
  const title = useMemo(() => {
    const content = state.getCurrentContent();
    const block = content.getFirstBlock();
    return block.getText();
  }, [state]);

  const onChange = (newState: EditorState) => {
    newState = enforceTitle(newState);
    setState(newState);
  }

  return (
    <EditorCtx.Provider value={{ editing: true, files: [files, setFiles] }}>
      <div>
        <TagsSelector2 tags={tags} setTags={setTags}/>

        <div className="mt-4 px-4 pt-2 markdown editor color-contrast-700">
          <Toolbar state={state} setState={setState}/>

          <DraftEditor
            editorState={state}
            onChange={onChange}
            plugins={plugins}
            spellCheck
            blockStyleFn={styling}
            blockRendererFn={render}
          />
        </div>

        <button onClick={() => {
          console.log(files);

          if (title)
            onSubmit(
              title,
              convertToRaw(state.getCurrentContent()),
              Array.from(tags)
            )
        }} className={`bg-green-400 ${title ? "hover:bg-green-300" : "bg-green-200 cursor-not-allowed"} py-1.5 
          px-3 rounded-lg text-contrast-300`}
        >
          Archive
        </button>
      </div>
    </EditorCtx.Provider>
  );
}

export const ReadonlyEditor: React.FC<{
  state: EditorState
}> = ({ state }) => {
  if (!state) return null;

  return (
    <EditorCtx.Provider value={{ editing: false }}>
      <div className="mt-4 px-4 pt-2 markdown editor color-contrast-700">
        <DraftEditor
          editorState={state}
          plugins={plugins}
          blockStyleFn={styling}
          blockRendererFn={render}
          readOnly={true}
          onChange={() => void 0}/>
      </div>
    </EditorCtx.Provider>
  );
}
