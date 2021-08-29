import React from "react";
import { Header } from "../components/header";
import Scrollbar from "react-smooth-scrollbar";

export const DefaultLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className="flex page">
    <Header/>

    <div className="w-full h-full bg-contrast-300">
      {/*<Scrollbar>*/}
        <main className="
          w-full h-screen
          px-14 sm:px-20 lg:px-28 py-12
          text-contrast-800 overflow-y-auto overflow-x-hidden
        ">
          {children}
        </main>
      {/*</Scrollbar>*/}
    </div>
  </div>
);
