import { useState } from "react";

enum Mode {
  LIGHT,
  DARK
}

export function LightsButton() {
  const [mode, setMode] = useState(Mode.LIGHT);

  const updateMode = () => {
    setMode(mode == Mode.LIGHT ?
      Mode.DARK :
      Mode.LIGHT);

    document.documentElement.setAttribute("darkmode", String(mode == Mode.LIGHT));
  }

  return (
    <span className="material-icons lights-button" onClick={updateMode}>
      {mode == Mode.LIGHT ?
        "light_mode" :
        "dark_mode"}
    </span>
  )
}
