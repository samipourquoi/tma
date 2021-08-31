import React from "react";
import { Header } from "../components/header";
import Scrollbar from "react-smooth-scrollbar";
import { NewHeader } from "../components/new-header";

export const DefaultLayout: React.FC<{
  children: React.ReactNode,
  title?: React.ReactNode
}> = ({ children, title }) => (
  <div className="">
    {/*<Header/>*/}
    <NewHeader/>

    {title ? (
      <div className="bg-main-green md:px-[10%] flex justify-center text-main-dark-green">
        <div className="lg:max-w-[1200px] w-full py-12">
          {title}
        </div>
      </div>
    ) : null}

    <div className="mt-4 w-full h-full bg-contrast-300 md:px-[10%] flex justify-center">
      {/*<Scrollbar>*/}
        <main className="
          lg:max-w-[1200px] w-full
          text-contrast-800 overflow-x-hidden
        ">
          {children}
        </main>
      {/*</Scrollbar>*/}
    </div>
  </div>
);
