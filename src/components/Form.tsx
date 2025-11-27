import { useEffect, useState } from "react";

export type FormField<T> = {
  name: keyof T;
  label: string;
  type?: "text" | "number" | "json" | "select" | "product-list";
  options?: { label: string; value: string }[]; 
};

type FormProps<T> = {
  initialValues: T;
  onSubmit: (values: T) => void;
  onCancel?: () => void;
  fields: FormField<T>[];
  submitLabel?: string;
};

export default function Form<T>({ initialValues, onSubmit, onCancel, fields, submitLabel }: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (name: keyof T, value: any) => {
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      {fields.map((field) => {
        const fieldValue = values[field.name];

        return (
          <div key={String(field.name)} className="flex flex-col">
            <label className="font-semibold mb-1">{field.label}</label>

            {/* ---- SELECT ---- */}
            {field.type === "select" && (
              <select
                value={String(fieldValue ?? "")}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="border px-2 py-1 rounded"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* ---- PRODUCT LIST (SELECT + QUANTITY) ---- */}
            {field.type === "product-list" && Array.isArray(fieldValue) && (
              <div className="space-y-3">
                {fieldValue.map((prod: any, index: number) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={prod.name}
                      onChange={(e) => {
                        const updated = [...fieldValue];
                        updated[index].name = e.target.value;
                        handleChange(field.name, updated);
                      }}
                      className="border px-2 py-1 rounded flex-1"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Qtd"
                      value={prod.quantity}
                      onChange={(e) => {
                        const updated = [...fieldValue];
                        updated[index].quantity = Number(e.target.value);
                        handleChange(field.name, updated);
                      }}
                      className="border px-2 py-1 rounded w-24"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updated = fieldValue.filter((_: any, i: number) => i !== index);
                        handleChange(field.name, updated);
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    handleChange(field.name, [...fieldValue, { name: "", quantity: 0 }])
                  }
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  + Adicionar Produto
                </button>
              </div>
            )}

            {/* ---- JSON / TEXT / NUMBER DEFAULT ---- */}
            {!["select", "product-list"].includes(field.type || "") && (
              <input
                type={field.type === "number" ? "number" : "text"}
                value={
                  field.type === "json"
                    ? JSON.stringify(fieldValue ?? [])
                    : String(fieldValue ?? "")
                }
                onChange={(e) => {
                  let val: any = e.target.value;
                  if (field.type === "number") val = Number(val);
                  if (field.type === "json") {
                    try {
                      val = JSON.parse(val);
                    } catch {
                      val = [];
                    }
                  }
                  handleChange(field.name, val);
                }}
                className="border px-2 py-1 rounded"
              />
            )}
          </div>
        );
      })}

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {submitLabel || "Salvar"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              setValues(initialValues);
              onCancel();
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
