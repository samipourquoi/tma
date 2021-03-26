import React from "react";
import Tag from "./tag";
import { GET_ArchiveResult } from "hamlet/api";

interface TableProps {
  rows: (GET_ArchiveResult | null)[]
}

export default function Table({ rows }: TableProps) {
  rows = new Array(22)
    .fill(null)
    .map((_, i) => rows[i] || null)

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Title</th>
            <th>Version</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => row ? (
            <tr key={i}>
              <th>
                <span className="row-id">
                  #{row.id}
                </span>
                {row.author.name}
                </th>
              <th>
                {row.title}
                <span className="tags">
                  {row.tags.map((tag, j) =>
                    <Tag key={j} type={tag}/>
                  )}
                </span>
              </th>
              <th>{row.version}</th>
              <th>{formatDate(new Date(row.createdAt))}</th>
            </tr>
          ) : (
            <tr key={i}>
              <th/>
              <th/>
              <th/>
              <th/>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

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
