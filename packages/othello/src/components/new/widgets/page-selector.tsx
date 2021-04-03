import React, { useState } from "react";

export interface PageSelectorProps {
  pageAmount: number,
  page: number,
  setPage: (page: number) => void
}

export const PageSelector: React.FC<PageSelectorProps> = ({ pageAmount, page, setPage }) => {
  const [value, setValue] = useState<string>(String(page));

  const isAtStart = page == 1;
  const isAtEnd   = page == pageAmount;

  const updatePage = (number: -1 | 1) => () => {
    if ((isAtStart && number == -1)
      || isAtEnd && number == +1) return;
    const newPage = page + number;
    setValue(String(newPage));
    setPage(newPage);
  }

  return (
    <label className="widget">
      Page <input type="text" className="mx-1 rounded-lg bg-white text-center"
                  style={{ width: `${value.length+1}ch` }}
                  value={value}
                  name="page"
                  onBlurCapture={(ev) => {
                    ev.preventDefault();
                    console.log("test");
                    const value = +ev.target.value;
                    if (value && 0 < value && value <= pageAmount) {
                      setPage(value);
                    } else
                      setValue(String(page));
                  }}
                  onChange={(ev) => setValue(ev.target.value)}/>
        on {pageAmount}

      <span className={`material-icons ${isAtStart ? "cursor-not-allowed text-gray-400" : "cursor-pointer"}`}
            onClick={ev => {
              ev.preventDefault();
              updatePage(-1)();
            }}>
        arrow_back</span>
      <span className={`material-icons ${isAtEnd ? "cursor-not-allowed text-gray-400" : "cursor-pointer"}`}
            onClick={ev => {
              ev.preventDefault();
              updatePage(1)();
            }}>
        arrow_forward</span>
    </label>
  );
}
