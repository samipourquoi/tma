import { useState } from "react";

export interface PageSelectorProps {
  pageAmount: number
}

export default function PageSelector(
  { pageAmount }: PageSelectorProps
) {
  const [page, setPage] = useState(1);
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
