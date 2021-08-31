import React, { useContext, useState } from "react";
import { useUser } from "../hooks/use-user";
import Link from "next/link";
import Image from "next/image";
import Popup from "reactjs-popup";
import { DarkModeCtx } from "../contexts";
import * as Icons from "phosphor-react";
import { disconnect } from "../api";
import { useQueryClient } from "react-query";

export const ProfilePopup: React.FC = () => {
  const user = useUser();
  const { dark, setDark } = useContext(DarkModeCtx);
  const queryClient = useQueryClient();

  if (!user.data)
    return null;

  return (
    <div className="bg-main-beige transition-all p-4">
      <div className="pb-2">
        {user.data.name}
      </div>

      <div className="border-b border-t border-main-dark-beige py-4">
        <div>
          <Link href="/settings">SETTINGS</Link>
        </div>
        <div className="mt-2 cursor-pointer" onClick={() => {
          disconnect()
            .then(() => queryClient.setQueryData("user", null))
        }}>
          DISCONNECT
        </div>
      </div>

      <div className="pt-4">
        <span className="group flex items-center cursor-pointer hover:text-yellow-500" onClick={() => {
          setDark(!dark);
        }}>
          <div>
            <Icons.Lightbulb size={20}/>
          </div>
          <span>
            {dark ? "Light Mode" : "Dark Mode"}
          </span>
        </span>
      </div>
    </div>
  );
}

export const NewHeader: React.FC = () => {
  const [popupEnabled, setPopupEnabled] = useState(false);
  const user = useUser();

  return (
    <div>
      <header className="p-4 md:px-[10%] text-gray-800 border-b">
        <div className="mx-auto lg:max-w-[1200px] font-medium flex justify-between items-center">
          <Link href="/">
            <a className="font-logo text-4xl">TMA</a>
          </Link>

          <nav className="flex justify-between items-center">
            <Link href="/">
              <a className="mx-2">ARCHIVE</a>
            </Link>
            {user.data ? (
              <>
                <Link href="/submit">
                  <a className="mx-2">SUBMIT</a>
                </Link>
                <Link href="/saved">
                  <a className="mx-2">SAVED</a>
                </Link>
                <div
                  className="mx-2 flex items-center group"
                  // onMouseOver={() => setPopupEnabled(true)}
                  // onMouseOut={() => setPopupEnabled(false)}
                >
                  <Image
                    className="rounded"
                    src={`https://cdn.discordapp.com/avatars/${user.data.discordID}/${user.data.avatar}.png?size=64`}
                    width={42} height={42}
                  />

                  <div className="hidden group-hover:block absolute mt-32 py-4">
                    <ProfilePopup/>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/api/auth/discord">
                <a className="bg-black text-white font-normal px-4 py-3 ml-2">
                  LOGIN VIA DISCORD
                </a>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}
