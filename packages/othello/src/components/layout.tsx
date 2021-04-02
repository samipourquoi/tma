import React from "react";
import Header from "./header";

interface LayoutProps {
  children: React.ReactNode,
  header?: unknown
}

export default function Layout({ children, header }: LayoutProps) {
  return (
    <div className="old layout">
      {header ? <Header/> : void 0}

      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}
