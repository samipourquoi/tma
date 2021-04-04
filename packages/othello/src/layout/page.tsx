import React from "react";
import { NewHeader } from "../components/header";

export const Page: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className="flex page">
    <NewHeader/>

    <main className="
      w-full h-screen overflow-y-scroll
      px-14 sm:px-20 lg:px-28 py-12
    ">
      {children}
    </main>
  </div>
);
