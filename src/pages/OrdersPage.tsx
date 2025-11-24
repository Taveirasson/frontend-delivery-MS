import { useEffect, useState } from "react";
// import { OrderService } from "../services/orderService";
import Table from "../components/Table";
import Form from "../components/Form";
import type { Order, Product } from "../types";
import { MockOrderService } from "../services/mockService";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Order | null>(null);
  const [clientEmail, setClientEmail] = useState("");


  const fetchOrders = () => {
    MockOrderService.findAll().then(res => setOrders(res));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleSubmit = (order: Omit<Order, "id" | "status" | "createAt">) => {
    if (editing?.id) {
      MockOrderService.update(editing.id, order).then((updated) => { 
          if(updated) {
            setOrders(prev => prev.map(o => o.id === editing.id ? updated : o));
            fetchOrders(); 
            setEditing(null); 
          }
        });
    } else {
      const newOrder = {
        ...order,
        id: `o${orders.length + 1}`,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      MockOrderService.create(newOrder).then((created) => {
        setOrders(prev => [...prev, created]);
        setEditing(null);
        fetchOrders()});
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente deletar?")) {
      MockOrderService.deleteById(id).then((success) => {
        if (success ) { 
          setOrders(orders.filter(o => o.id !== id));
          fetchOrders();
        }
      });
    }
  };

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (editing) setProducts(editing.products);
    else setProducts([{ name: "", quantity: 0 }]);
  }, [editing]);

  const handleProductChange = (index: number, key: keyof Product, value: string | Number) => {
    const newProducts = [...products];
    if(key === "quantity"){
      newProducts[index][key] = Number(value);
    } else{
      newProducts[index][key] = String(value) as any;
    }
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: 0 }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = { clientEmail, products };
    handleSubmit(orderData);
    setClientEmail("");
    setProducts([{ name: "", quantity: 0 }]);
  };


  return (
    <div className="space-y-6">
    <h1 className="text-2xl font-bold">Pedidos</h1>

    <form onSubmit={handleOrderSubmit} className="space-y-4 p-4 border rounded bg-white">
      <div className="flex flex-col">
        <label className="font-semibold">Email do Cliente</label>
        <input
          type="text"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      <div className="space-y-2">
        {products.map((prod, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Nome do produto"
              value={prod.name}
              onChange={(e) => handleProductChange(index, "name", e.target.value)}
              className="border px-2 py-1 rounded flex-1"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={prod.quantity}
              onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
              className="border px-2 py-1 rounded w-24"
            />
            <button type="button" onClick={() => removeProduct(index)} className="bg-red-600 text-white px-2 py-1 rounded">
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addProduct} className="bg-green-600 text-white px-2 py-1 rounded">
          + Adicionar Produto
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editing ? "Atualizar Pedido" : "Criar Pedido"}
      </button>
    </form>

    <Table
      data={orders}
      columns={[
        { key: "clientEmail", label: "Cliente" },
        { key: "id", label: "ID" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Criado em" },
      ]}
      actions={(item) => (
        <div className="flex gap-2">
          <button
            className="bg-yellow-500 px-2 rounded"
            onClick={() => {
              setEditing(item);
              setClientEmail(item.clientEmail);
            }}
          >
            Editar
          </button>
          <button
            className="bg-red-600 px-2 rounded"
            onClick={() => handleDelete(item.id!)}
          >
            Excluir
          </button>
        </div>
      )}
    />
  </div>
  );
}
