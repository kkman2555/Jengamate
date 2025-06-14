
// This CSV export helper is moved from useUserManagement.ts
// Note: This function has a minor bug from the original code where it might not correctly handle JSX in cells.
// For now, it is kept as-is to maintain original functionality.
function toCSV(rows: any[], columns: any[]) {
  const escapeCSV = (val: any) =>
    `"${String(val ?? '').replace(/"/g, '""')}"`;
  const header = columns.map((c) => escapeCSV(c.header)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((col) =>
          escapeCSV(col.cell ? col.cell(row) : row[col.accessorKey])
        )
        .join(',')
    )
    .join('\n');
  return header + '\n' + body;
}

export function exportToCSV(rows: any[], columns: any[], filename: string) {
    const coreColumns = columns.filter(
        (col) =>
            !["checkbox", "actions"].includes(
                typeof col.accessorKey === "string" ? col.accessorKey : ""
            )
    );
    const csv = toCSV(rows, coreColumns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
