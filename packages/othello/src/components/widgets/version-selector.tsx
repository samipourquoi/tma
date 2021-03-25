import TextDisplay from "./text-display";

export default function VersionSelector() {
  return (
    <label className="version-selector">
      Version

      <select className="text-display">
        <option>any</option>
        <option>1.12</option>
        <option>1.13</option>
        <option>1.14</option>
        <option>1.15</option>
        <option>1.16</option>
        <option>1.17</option>
      </select>
      {/*Version <TextDisplay display="any"/>*/}
    </label>
  )
}
