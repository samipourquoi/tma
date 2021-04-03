import React from "react";

export const VersionSelector: React.FC<{
  version: string;
  setVersion(version: string): void;
}> = ({ version, setVersion }) => (
  <label className="widget">
    Version

    <select
      className="mx-1 rounded-lg bg-white appearance-none text-center px-2 py-1"
      name="version"
      value={version}
      onChange={ev => {
        setVersion(ev.target.value);
      }}
    >
      <option>any</option>
      <option>1.12</option>
      <option>1.13</option>
      <option>1.14</option>
      <option>1.15</option>
      <option>1.16</option>
      <option>1.17</option>
      <option>*</option>
    </select>
  </label>
);
