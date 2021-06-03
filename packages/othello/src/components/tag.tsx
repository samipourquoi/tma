import { TagType } from "@tma/api";
import React from "react";

export interface TagProps {
  type: TagType,

  onDelete?(): void;
}

function typeToColor(type: TagType): string {
  return ({
      "redstone": "bg-tags-redstone",
      "slimestone": "bg-tags-slimestone",
      "storage": "bg-tags-storage",
      "farms": "bg-tags-farms",
      "mob-farms": "bg-tags-mob-farms",
      "bedrock": "bg-tags-bedrock",
      "computational": "bg-tags-computational",
      "other": "bg-tags-other"
    } as { [k: string]: string })[type]
    || "border border-gray-300";
}

export const Tag: React.FC<TagProps> = ({ type, onDelete }) => (
  <div className={`
    ${typeToColor(type)} rounded-full px-2 py-0.5 text-white font-light 
    inline-flex justify-center items-center text-sm text-contrast-300
  `}>
    <span className="lowercase">
      {type.replace(/-/g, " ")}
    </span>

    {onDelete ?
      <span className="material-icons cursor-pointer text-base ml-1" onClick={onDelete}>
        clear
      </span> :
      null}
  </div>
);

