import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { GET } from "hamlet/api";
import { fetcher } from "../api";
import { useUser } from "../hooks/use-user";

export const NewHeader: React.FC = () => {
  const [isForcedVisible, setForcedVisible] = useState(false);

  return (
    <div className="flex h-screen min-w-max absolute md:relative">
      <header className={`
        ${isForcedVisible ? "flex" : "hidden"} bg-gray-50 h-screen text-gray-400 text-lg
        flex flex-col relative border shadow-xl
        md:shadow-none
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

const Profile: React.FC = () => {
  const user = useUser();

  return user ? (
    <div className="flex items-center">
      <div className="md:hidden lg:block">
        <Image className="rounded-xl" src={`https://cdn.discordapp.com/avatars/${user.discordID}/${user.avatar}.png?size=64`} width={ 64 } height={ 64 }/>
      </div>
      <div className="w-full ml-4 md:ml-0 lg:ml-4 flex items-center flex-wrap">
        <div className="w-full font-logo text-2xl flex align-middle">
          <span>
            TMA
          </span>
          <a className="material-icons text-xl hover:text-gray-500 cursor-pointer mt-0.5 ml-1" href="/api/auth/disconnect">
            logout
          </a>
        </div>
        <div className="w-full font-light">{user.name}</div>
      </div>
    </div>
  ) : (
    <div className="bg-purple-400 active:bg-purple-500 rounded-xl p-2 text-white shadow">
      <a className="flex justify-center align-middle" href="/api/auth/discord">Log in</a>
    </div>
  );
};

const Navigation: React.FC = () => (
  <nav className="mt-5">
    {[
      ["/", "home", "Home"],
      ["/submit", "add_to_photos", "Submit"],
      ["/saved", "bookmark", "Saved"],
    ].map(([href, emote, name]) => (
      <Link href={href} key={name}>
        <a className="
          flex items-center my-3 font-light
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
      <h2 className="mb-4 text-2xl">Search</h2>
      <input type="text" placeholder={placeholder} className="
        w-full outline-none border-none p-3.5 rounded-xl text-base font-light
        text-gray-600 shadow
      "/>
    </div>
  );
}

const TagList: React.FC = () => {
  const tags: {
    color: string,
    name: string
  }[] = [
    { color: "bg-tags-redstone", name: "Redstone" },
    { color: "bg-tags-slimestone", name: "Slimestone" },
    { color: "bg-tags-storage", name: "Storage" },
    { color: "bg-tags-farms", name: "Farms" },
    { color: "bg-tags-mob-farms", name: "Mob farms" },
    { color: "bg-tags-bedrock", name: "Bedrock break." },
    { color: "bg-tags-computational", name: "Computational" },
    { color: "bg-tags-other", name: "Other" }
  ];

  return (
    <div>
      <h2 className="mb-4 text-2xl">Tags</h2>
      <ul>
        {tags.map(tag => (
          <li key={tag.name} className="my-5">
            <Link href="">
              <a className="flex items-center">
                <div className={`${tag.color} w-5 h-5 rounded-full`}/>
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
