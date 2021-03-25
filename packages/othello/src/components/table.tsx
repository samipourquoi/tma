import React from "react";

export interface Row {
  author: string,
  title: string,
  version: string,
  tags: React.ReactNode,
  date: Date,
}

interface TableProps {
  rows: (Row | null)[]
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
          {rows.map(row => row ? (
            <tr>
              <th>{row.author}</th>
              <th>
                {row.title}
                <span className="tags">{row.tags}</span>
              </th>
              <th>{row.version}</th>
              <th>{row.date.toDateString()}</th>
            </tr>
          ) : <tr>{new Array(4).fill(<th/>)}</tr>)}
        </tbody>
      </table>
    </div>
  )
}
