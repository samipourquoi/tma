import { TagType } from "@tma/api";
import React, { useState } from "react";
import tagsSpec from "@tma/api/tags.json";
import Scrollbar from "react-smooth-scrollbar";

export interface TagProps {
  type: TagType,

  onDelete?(): void;
}

const tagToIndex = Object.fromEntries(
  Object.entries(tagsSpec)
    .map(([group, tags]) => tags as string[])
    .flat()
    .map((tag, i) => [tag, i])
);

const style = (type: TagType): React.CSSProperties => {
  const index: number | null = tagToIndex[type] ?? null;
  if (index == null)
    return {
      borderWidth: "1px",
      borderColor: "gray",
      backgroundColor: "rgba(212, 212, 212, 1)"
    }

  // 360 goes back to red, so we stop at purple which is at 310.
  const perc = index * 310 / Object.entries(tagToIndex).length;
  console.log(perc);
  return {
    background: `hsl(${perc}, 50%, 50%)`
  }
}

export const CustomTag: React.FC = () => {
  const [value, setValue] = useState("");
  const placeholder = "custom...";

  return (
    <Tag type={value}>
      <input
        className="bg-transparent outline-none"
        placeholder={placeholder}
        onChange={e => setValue(e.target.value.toLowerCase())}
        value={value}
        style={{
          width: `${(value || placeholder).length}ch`
        }}
      />
    </Tag>
  );
}

export const Tag: React.FC<TagProps> = (
  {
    type,
    onDelete,
    children
  }
) => (
  <div className={`
    rounded-full px-2 py-0.5 text-white font-light 
    inline-flex justify-center items-center text-sm text-contrast-400
    whitespace-nowrap
  `} style={style(type)}>
    {children ? children : (
      <span className="lowercase">
        {type.replace(/-/g, " ")}
      </span>
    )}

    {onDelete ?
      <span className="material-icons cursor-pointer text-base ml-1" onClick={onDelete}>
        clear
      </span> :
      null}
  </div>
);


export const TagsSelector2: React.FC<{
  tags: Set<TagType>,
  setTags: (tags: Set<TagType>) => void
}> = ({ tags, setTags }) => {
  return (
    <div className="">
      <ul className="tags-selector2">
        {Object.entries(tagsSpec).map(([group, tags2]) =>
          tags2.map((tag: string) => (
            <li
              className={`cursor-pointer inline-block m-0.5 ${tags.has(tag) ? "" : "opacity-[0.45]"} transition-opacity`}
              onClick={() => {
                const newTags = new Set(tags);
                if (tags.has(tag)) newTags.delete(tag);
                else newTags.add(tag);
                setTags(newTags);
              }}
            >
              <Tag type={tag}/>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

