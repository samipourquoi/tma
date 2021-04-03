import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const NewHeader: React.FC = () => {
  const [isForcedVisible, setForcedVisible] = useState(false);

  return (
    <div className="flex h-screen min-w-max absolute md:relative">
      <header className={`
        ${isForcedVisible ? "flex" : "hidden"} bg-gray-50 h-screen text-gray-400 text-xl
        flex flex-col relative border
        md:flex md:rounded-r-none
      `}>
        <div className="overflow-y-auto p-7">
          <Profile/>
          <Navigation/>
          <SearchBar/>
          <TagList/>
        </div>
        <OptionsBar/>
      </header>

      <div className={`
        material-icons text-gray-400 shadow ${isForcedVisible ? "" : "absolute"}
        top-0 bg-gray-50 w-12 h-12 rounded-xl m-3 flex justify-center items-center cursor-pointer
        md:hidden
      `} onClick={() => setForcedVisible(!isForcedVisible)}>
        {isForcedVisible ? "navigate_before" : "navigate_next"}
      </div>
    </div>
  );
}

const Profile: React.FC = () => (
  <div className="flex items-center">
    <div className="md:hidden lg:block">
      <Image className="rounded-xl" src="/images/default-user.png" width={65} height={65}/>
    </div>
    <div className="w-full ml-4 md:ml-0 lg:ml-4 flex items-center flex-wrap">
      <div className="w-full font-logo text-2xl">TMA</div>
      <div className="w-full">samipourquoi</div>
    </div>
  </div>
);

const Navigation: React.FC = () => (
  <nav className="mt-5">
    {[
      ["/", "home", "Home"],
      ["/submit", "add_to_photos", "Submit"],
      ["/saved", "bookmark", "Saved"],
    ].map(([href, emote, name]) => (
      <Link href={href} key={name}>
        <a className="
          flex items-center my-4 font-light
          hover:text-gray-500
        ">
          <span className="material-icons mr-2">{emote}</span>
          {name}
        </a>
      </Link>
    ))}
  </nav>
);

const SearchBar: React.FC = () => {
  const placeholders = [
    "Tree farm",
    "Egg dropper",
    "Creeper farm",
    "Bedrock breaker",
    "Monostable AND gate",
    "Quarry",
    "Instant wire",
    "Chunk loader",
    "Villager hall"
  ];
  const placeholder = `${placeholders[new Date().getMinutes() % placeholders.length]}...`;

  return (
    <div className="py-9 my-9 border-t border-b border-gray-300">
      <h2 className="mb-5 text-2xl">Search</h2>
      <input type="text" placeholder={placeholder} className="
        w-full outline-none border-none p-3.5 rounded-xl text-base font-light
        text-gray-600 shadow
      "/>
    </div>
  );
}

const TagList: React.FC = () => {
  const tags: {
    emoji: string,
    name: string
  }[] = [
    { emoji: "⚡️", name: "Redstone" },
    { emoji: "🐸", name: "Slimestone" },
    { emoji: "💾", name: "Storage" },
    { emoji: "🚜", name: "Farms" },
    { emoji: "🐲", name: "Mob farms" },
    { emoji: "💥", name: "Bedrock break." },
    { emoji: "📺", name: "Computational" },
    { emoji: "🌈", name: "Other" }
  ];

  return (
    <div>
      <h2 className="mb-5 text-2xl">Tags</h2>
      <ul>
        {tags.map(tag => (
          <li key={tag.name} className="my-5">
            <Link href="">
              <a>
                <span>
                  {tag.emoji}</span>
                <span className="ml-4 font-light text-gray-400 hover:text-gray-500">
                  {tag.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const OptionsBar: React.FC = () => {
  const [darken, setDarken] = useState(false);

  return (
    <div className="min-h-10 p-7 py-5 flex justify-start items-center">
      <div className="material-icons mr-5">settings</div>

      <div className="material-icons cursor-pointer text-gray-400 hover:text-gray-500" onClick={() => {
        setDarken(!darken);
      }}>
        {darken ? "dark_mode" : "light_mode"}
      </div>
    </div>
  );
}
