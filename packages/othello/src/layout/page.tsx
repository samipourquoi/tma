import React from "react";
import { NewHeader } from "../components/header";
import Scrollbar from "react-smooth-scrollbar";

export const Page: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className="flex page">
    <NewHeader/>

    <div className="w-full h-full bg-contrast-300">
      <Scrollbar>
        <main className="
          w-full h-screen
          px-14 sm:px-20 lg:px-28 py-12
          text-contrast-800
        ">
          {children}
        </main>
      </Scrollbar>
    </div>
  </div>
);
