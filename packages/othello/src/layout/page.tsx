import React from "react";
import { NewHeader } from "../components/header";

export const Page: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className="flex">
    <NewHeader/>

    <main className="w-full h-screen overflow-y-scroll">
      {children}
    </main>
  </div>
);
