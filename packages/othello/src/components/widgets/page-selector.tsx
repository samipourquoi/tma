import { useState } from "react";

export interface PageSelectorProps {
  pageAmount: number,
  page: number,
  setPage: (page: number) => void
}

export default function PageSelector(
  { pageAmount, page, setPage }: PageSelectorProps
) {
  const isAtStart = page == 1;
  const isAtEnd   = page == pageAmount;

  const updatePage = (number: -1 | 1) => () => {
    const newPage = page + number;

    if ((isAtStart && number == -1)
      || isAtEnd && number == +1)
    {
      return;
    }

    setPage(page + number);
  }

  return (
    <label className="page-selector">
      Page {page} on <span className="text-display">{pageAmount}</span>

      <span className={`material-icons ${isAtStart ? "disabled-icon" : ""}`}
            onClick={updatePage(-1)}>
        arrow_back</span>
      <span className={`material-icons ${isAtEnd ? "disabled-icon" : ""}`}
            onClick={updatePage(1)}>
        arrow_forward</span>
    </label>
  );
}
