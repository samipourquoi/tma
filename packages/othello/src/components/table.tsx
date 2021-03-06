import React from "react";
import { Tag } from "./tag";
import Link from "next/link";
import { getTitleUriFromArchive } from "../pages/archive/[id]";
import { ApiResult } from "@tma/api";
import { ArchiveAttributes, Attributes, FullArchiveAttributes } from "@tma/api/attributes";

export const Table: React.FC<{
  rows: FullArchiveAttributes[]
}> = ({ rows }) => {
  const shownRows = Array(30)
    .fill(null)
    .map((_, i) => rows[i] || null);

  return (
    <table className="w-full">
      <thead className="text-contrast-600">
      <tr className="table-row border-t-2 border-b-2 border-contrast-500 bg-contrast-300">
        <th className="w-2/6 md:w-1/6 font-medium">Author</th>
        <th className="max-w-full font-medium">Title</th>
        <th className="w-1/6 hidden md:table-cell font-medium">Date</th>
      </tr>
      </thead>
      <tbody className="text-gray-400 font-light">
      {shownRows.map((row, i) => (
        <Row key={i} row={row}/>
      ))}
      </tbody>
    </table>
  );
}

const Row: React.FC<{
  row: FullArchiveAttributes | null
}> = ({ row }) => (
  <tr className="table-row odd:bg-contrast-400 dark:odd:bg-gray-800 even:bg-contrast-300">
    <td className="text-center">
      {row?.author.name || ""}
    </td>
    <td>
      <Link href={row ? `/archive/${getTitleUriFromArchive(row)}` : "/archive"}>
        <a className="hover:underline break-all">
          {row?.title}
        </a>
      </Link>

      <ul className="inline">
        {row?.tags.map((tag, i) => (
          <li key={i} className="inline ml-2">
            <Tag type={tag}/>
          </li>
        ))}
      </ul>
    </td>
    <td className="text-center hidden md:table-cell">
      {row ? formatDate(new Date((row as unknown as Attributes /* oopsie */).createdAt!)) : ""}
    </td>
  </tr>
)

function formatDate(timestamp: Date | number):
  string {
  const date = new Date(timestamp);
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  return day + "/" + month + "/" + year;
}
