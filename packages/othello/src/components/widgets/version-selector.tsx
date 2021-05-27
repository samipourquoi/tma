import React from "react";
import { versions } from "../../constants";

export const VersionSelector: React.FC<{
  version: string;
  setVersion(version: string): void;
}> = ({ version, setVersion }) => (
  <label className="widget">
    Version

    <select
      className="mx-1 rounded-lg bg-contrast-300 dark:bg-contrast-500 appearance-none text-center px-2 py-1"
      name="version"
      value={version}
      onChange={ev => {
        setVersion(ev.target.value);
      }}
    >
      {versions.map(version => (
        <option key={version}>{version}</option>
      ))}
    </select>
  </label>
);
