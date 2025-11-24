import { useEffect, useState } from "react";
// import { ProductService } from "../services/productService";
import Table from "../components/Table";
import Form from "../components/Form";
import type { Product } from "../types";
import { MockProductService } from "../services/mockService";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => MockProductService.findAll().then(res => setProducts(res));

  const handleSubmit = (product: Product) => {
    if (editing?.id) {
      MockProductService.update(editing.id, product).then((updated) => {
        if(updated) {
          setProducts(prev => prev.map(p => p.id === editing.id ? updated : p));
          fetchProducts(); 
          setEditing(null);
        }
      });
    } else {
      MockProductService.create(product).then((newProduct) => {
        setProducts(prev => [...prev, newProduct]);
        fetchProducts()
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente deletar?")) {
      MockProductService.deleteById(id).then((success) => {
        if(success){
          setProducts(products.filter(p => p.id !== id));
          fetchProducts()
        } 
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
