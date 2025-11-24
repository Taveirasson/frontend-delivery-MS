import type { ReactNode } from "react";

type TableProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  actions?: (item: T) => ReactNode;
};

export default function Table<T>({ data, columns, actions }: TableProps<T>) {
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col) => (
            <th key={String(col.key)} className="border p-2">{col.label}</th>
          ))}
          {actions && <th className="border p-2">Ações</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i} className="hover:bg-gray-100">
            {columns.map((col) => {
              const value = item[col.key];
              return (
                <td key={String(col.key)} className="border p-2">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </td>
              );
            })}
            {actions && <td className="border p-2">{actions(item)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
