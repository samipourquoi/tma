import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { disconnect } from "../api";
import { useDarkMode } from "../hooks/use-dark-mode";
import Scrollbar from "react-smooth-scrollbar"
import { useQueryClient } from "react-query";
import { useUser } from "../hooks/use-user";
import Router from "next/router";
import { SearchCtx } from "../contexts";

export const NewHeader: React.FC = () => {
  const [isForcedVisible, setForcedVisible] = useState(false);

  return (
    <div className="
      flex h-screen min-w-max absolute md:relative
      text-gray-400 z-10
    ">
      <header className={`
        ${isForcedVisible ? "flex" : "hidden"}  h-screen text-lg
        flex flex-col relative shadow-xl bg-contrast-400
        md:shadow-none
        md:flex md:rounded-r-none
      `}>
        <div className="flex flex-col justify-between h-screen">
          <Scrollbar>
            <div className="p-7">
              <Profile/>
              <Navigation/>
              <SearchBar/>
              <TagList/>
            </div>
          </Scrollbar>

          <OptionsBar/>
        </div>
      </header>

      <div className={`
        material-icons shadow ${isForcedVisible ? "" : "absolute"}
        top-0 w-12 h-12 rounded-xl m-3 flex justify-center items-center cursor-pointer
        md:hidden bg-contrast-400
      `} onClick={() => setForcedVisible(!isForcedVisible)}>
        {isForcedVisible ? "navigate_before" : "navigate_next"}
      </div>
    </div>
  );
}

const Profile: React.FC = () => {
  const user = useUser();

  return user.data ? (
    <div className="flex items-center">
      <div className="md:hidden lg:block">
        <Image className="rounded-xl"
               src={`https://cdn.discordapp.com/avatars/${user.data.discordID}/${user.data.avatar}.png?size=64`}
               width={64} height={64}/>
      </div>
      <div className="w-full ml-4 md:ml-0 lg:ml-4 flex items-center flex-wrap">
        <div className="w-full font-logo text-2xl flex align-middle">
          <span>
            TMA
          </span>
        </div>
        <div className="w-full font-light">{user.data.name}</div>
      </div>
    </div>
  ) : (
    <div className="click-button rounded-xl p-2 text-white shadow w-full">
      <a className="flex justify-center align-middle w-full" href="/api/auth/discord">Log in</a>
    </div>
  );
};

const Navigation: React.FC = () => {
  const user = useUser();

  return (
    <nav className="mt-5">
      {[
        ["/", "home", "Home"],
        ...(user.data ? [
          ["/submit", "add_to_photos", "Submit"],
          ["/saved", "bookmark", "Saved"]
        ] : []),
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
}

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
  const { search: [search, setSearch] } = useContext(SearchCtx);
  const [internal, setInternal] = useState(search);

  return (
    <div className="py-9 my-9 border-t border-b border-contrast-600">
      <h2 className="mb-4 text-2xl">Search</h2>
      <input name="search-string" type="text" placeholder={placeholder} className="
        w-full outline-none border-none p-3.5 rounded-xl text-base font-light
        text-contrast-700 dark:text-gray-300 shadow bg-contrast-300 dark:bg-contrast-500
      " value={internal} onChange={ev => setInternal(ev.target.value)} onKeyDown={ev => {
        if (ev.key == "Enter")
          setSearch(internal);
      }}/>
    </div>
  );
}

const TagList: React.FC = () => (
  <div>
    <h2 className="mb-4 text-2xl">Tags</h2>
    <ul>
      {[
        { color: "bg-tags-redstone", name: "Redstone" },
        { color: "bg-tags-slimestone", name: "Slimestone" },
        { color: "bg-tags-storage", name: "Storage" },
        { color: "bg-tags-farms", name: "Farms" },
        { color: "bg-tags-mob-farms", name: "Mob farms" },
        { color: "bg-tags-bedrock", name: "Bedrock break." },
        { color: "bg-tags-computational", name: "Computational" },
        { color: "bg-tags-other", name: "Other" }
      ].map(TagListEntry)}
    </ul>
  </div>
);

const TagListEntry: React.FC<{
  color: string,
  name: string
}> = ({ color, name }) => {
  const tagID = color.slice("bg-tags-".length);
  const { tags: [tags, setTags] } = useContext(SearchCtx);
  const [checked, setChecked] = useState(tags.has(tagID));

  useEffect(() => {
    const newTags = new Set(tags);
    newTags[checked ? "add" : "delete"](tagID);
    setTags(newTags);
  }, [checked]);

  return (
    <li>
      <label key={name} className="my-5 flex items-center cursor-pointer">
        <input name={tagID} className="hidden" type="checkbox" checked={checked} onChange={() => setChecked(!checked)}/>

        <div className={`${color} w-5 h-5 rounded-full flex justify-center items-center text-contrast-400 material-icons`}>
          {checked ? "close" : null}
        </div>
        <span className="ml-4 font-light hover:text-gray-500">
          {name}
        </span>
      </label>
    </li>
  );
}

const OptionsBar: React.FC = () => {
  const [dark, setDark] = useDarkMode();
  const user = useUser();
  const queryClient = useQueryClient();

  return (
    <div className="min-h-10 p-7 py-5 flex justify-start items-center children:cursor-pointer">
      <Link href="/settings">
        <a className="material-icons mr-5 hover:text-contrast-600">settings</a>
      </Link>

      <div className="material-icons text-gray-400 hover:text-yellow-500 mr-5" onClick={() => {
        setDark(!dark);
      }}>
        {dark ? "dark_mode" : "light_mode"}
      </div>

      {user.data ? (
        <span className="material-icons hover:text-red-500 mt-0.5 ml-1" onClick={() => {
          disconnect().then(() => queryClient.setQueryData("user", null));
        }}>
          logout
        </span>
      ) : null}
    </div>
  );
}
