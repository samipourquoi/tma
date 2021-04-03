import { TagType } from "hamlet/api";
import React from "react";

export interface TagProps {
  type: TagType,
  onDelete?(): void;
}

function typeToColor(type: TagType): string {
  return ([
    "redstone",
    "slimestone",
    "storage",
    "farms",
    "mob-farms",
    "bedrock",
    "computational",
    "other"
  ] as TagType[]).includes(type) ?
    `bg-tags-${type}` :
    "bg-gray-300";
}

export const Tag: React.FC<TagProps> = ({ type, onDelete }) => (
  <div className={`
    ${typeToColor(type)} rounded-full px-2 py-0.5 text-white font-light 
    inline-flex justify-center items-center
  `}>
    <span className="lowercase bg-t">
      {type.replace(/-/g, " ")}
    </span>

    {onDelete ?
      <span className="material-icons" onClick={onDelete}>
        clear
      </span> :
      null}
  </div>
);

