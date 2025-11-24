import { useEffect, useState } from "react";


type FormField<T> = {
  name: keyof T;
  label: string;
  type?: "text" | "number" | "json";
};

type FormProps<T> = {
  initialValues: T;
  onSubmit: (values: T) => void;
  fields: FormField<T>[];
  submitLabel?: string;
};

export default function Form<T>({ initialValues, onSubmit, fields, submitLabel }: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (name: keyof T, value: any, type?: string) => {
    if (type === "number") value = Number(value);
    if (type === "json") {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = [];
      }
    }
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      {fields.map((field) => (
        <div key={String(field.name)} className="flex flex-col">
          <label className="font-semibold">{field.label}</label>
          <input
            type={field.type === "number" ? "number" : "text"}
            value={
              field.type === "json" ? JSON.stringify(values[field.name] ?? []) :
              String(values[field.name] ?? "")}
            onChange={(e) => handleChange(field.name, e.target.value, field.type)}
            className="border px-2 py-1 rounded"
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{submitLabel || "Salvar"}</button>
    </form>
  );
}
