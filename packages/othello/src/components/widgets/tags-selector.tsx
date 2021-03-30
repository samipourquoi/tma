import { useState } from "react";
import { TagType } from "hamlet/api";
import Tag from "../tag";

export default function TagsSelector() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <div className="tags-selector">
      <input value={tags} name="tags" style={{
        display: "none"
      }}/>

      {tags.map((tag, i) => (
        <Tag type={tag} key={i} onDelete={() => {
          const newTags = [...tags];
          newTags.splice(i, 1);
          setTags(newTags);
        }}/>
      ))}

      <span className="material-icons add-button"
            onClick={() => setPopupVisible(!popupVisible)}>
        {popupVisible ? "remove" : "add"}
      </span>

      <div style={{
        display: popupVisible ? void 0 : "none"
      }}>
        <SearchPopup tags={tags} setTags={setTags}/>
      </div>
    </div>
  );
}

interface SearchPopupProps {
  tags: TagType[],
  setTags(tags: TagType[]): void
}

function SearchPopup({ tags, setTags }: SearchPopupProps) {
  const availableTags: TagType[] = [
    "redstone",
    "slimestone",
    "storage",
    "farms",
    "mob-farms",
    "bedrock",
    "computational",
    "other"
  ].filter(tag => !tags.includes(tag));

  return (
    <div className="search-popup">
      {availableTags.length > 0 ?

        availableTags.map((tag, i) => (
          <div className="search-entry" key={i} onClick={() => {
            setTags([...tags, tag]);
          }}>
            <Tag type={tag}/>
          </div>
        )) :

        <em>void</em>}
    </div>
  );
}
