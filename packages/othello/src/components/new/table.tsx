import React from "react";
import { GET_ArchiveResult } from "hamlet/api";
import { Tag } from "./tag";

export const Table: React.FC<{
  rows: GET_ArchiveResult[]
}> = ({ rows }) => {
  const shownRows = Array(22)
    .fill(null)
    .map((_, i) => rows[i] || null);

  return (
    <table className="w-full">
      <thead>
        <tr className="table-row">
          <th className="w-2/6 md:w-1/6">Author</th>
          <th className="max-w-full">Title</th>
          <th className="w-1/6 hidden md:table-cell">Date</th>
        </tr>
      </thead>
      <tbody>
        {shownRows.map((row,i) => (
          <Row key={i} row={row}/>
        ))}
      </tbody>
    </table>
  );
}

const Row: React.FC<{
  row: GET_ArchiveResult | null
}> = ({ row }) => (
  <tr className="table-row odd:bg-gray-100">
    <td className="text-center">
      {row?.author.name || ""}
    </td>
    <td>
      {row?.title || ""}
      <ul className="inline">
        {row?.tags.map((tag, i) => (
          <li key={i} className="inline ml-2">
            <Tag type={tag}/>
          </li>
        ))}
      </ul>
    </td>
    <td className="text-center hidden md:table-cell">
      {row ? formatDate(new Date(row.createdAt)) : ""}
    </td>
  </tr>
)

function formatDate(timestamp: Date | number):
  string
{
  const date = new Date(timestamp);
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  return day + "/" + month + "/" + year;
}
