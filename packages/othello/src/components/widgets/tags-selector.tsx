import React, { useState } from "react";
import { TagType } from "hamlet/api";
import { Tag } from "../tag";

export const TagsSelector: React.FC<{
  availableTags: string[]
}> = ({ availableTags }) => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <div className="widget">
      <input value={tags} name="tags" style={{
        display: "none"
      }}/>

      <ul className="flex flex-wrap">
        {tags.map((tag, i) => (
          <li key={i} className="p-0.5 h-full">
            <Tag type={tag} onDelete={() => {
              const newTags = [...tags];
              newTags.splice(i, 1);
              setTags(newTags);
            }}/>
          </li>
        ))}
      </ul>

      <span className="material-icons cursor-pointer ml-auto"
            onClick={() => setPopupVisible(!popupVisible)}>
        {popupVisible ? "remove" : "add"}
      </span>

      <div style={{
        display: popupVisible ? void 0 : "none"
      }}>
        <SearchPopup tags={tags} setTags={setTags} availableTags={availableTags}/>
      </div>
    </div>
  );
}

const SearchPopup: React.FC<{
  tags: TagType[],
  setTags(tags: TagType[]): void,
  availableTags: string[]
}> = ({ tags, setTags, availableTags }) => {
  const showableTags: TagType[] = availableTags.filter(tag => !tags.includes(tag));

  return (
    <div className="
      absolute bg-gray-50 shadow-lg rounded-xl px-4 py-2 transform translate-x-[-120%]
      cursor-pointer
    ">
      {showableTags.length > 0 ?

        showableTags.map((tag, i) => (
          <div className="my-1.5" key={i} onClick={() => {
            setTags([...tags, tag]);
          }}>
            <Tag type={tag}/>
          </div>
        )) :

        <em className="text-gray-500">void</em>}
    </div>
  );
}
