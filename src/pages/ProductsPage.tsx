import { useEffect, useState } from "react";
import Table from "../components/Table";
import Form from "../components/Form";
import type { Product } from "../types";
import { ProductService } from "../services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => ProductService.findAll().then(res => setProducts(res.data)).catch(err => {
    setProducts([]);
    console.log(err);
  });

  const handleSubmit = (product: Product) => {
    if (editing?.id) {
      ProductService.update(editing.id, product).then((updated) => {
        if(updated) {
          fetchProducts(); 
          setEditing(null);
        }
      });
    } else {
      ProductService.create(product).then(() => {
        fetchProducts()
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente deletar?")) {
      ProductService.delete(id).then(() => {
        fetchProducts()
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Produtos</h1>

      <Form
      key={editing ? editing.id : "new"}
        initialValues={editing ?? { name: "", quantity: 0 }}
        onSubmit={handleSubmit}
        fields={[{ name: "name", label: "Nome" }, { name: "quantity", label: "Quantidade", type: "number" }]}
        submitLabel={editing ? "Atualizar" : "Criar"}
      />

      <Table
        data={products}
        columns={[{ key: "name", label: "Nome" }, { key: "quantity", label: "Quantidade" }]}
        actions={(item) => (
          <div className="flex gap-2">
            <button className="bg-yellow-500 px-2 rounded" onClick={() => setEditing(item)}>Editar</button>
            <button className="bg-red-600 px-2 rounded" onClick={() => handleDelete(item.id!)}>Excluir</button>
          </div>
        )}
      />
    </div>
  );
}
