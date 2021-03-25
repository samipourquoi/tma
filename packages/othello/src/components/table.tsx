interface TableProps {
  rows: ({
    author: string,
    title: string,
    version: string,
    date: Date
  } | null)[]
}

export default function Table({ rows }: TableProps) {
  rows = new Array(30)
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
              <th>{row.title}</th>
              <th>{row.version}</th>
              <th>{row.date}</th>
            </tr>
          ) : <tr>{new Array(4).fill(<th/>)}</tr>)}
        </tbody>
      </table>
    </div>
  )
}
