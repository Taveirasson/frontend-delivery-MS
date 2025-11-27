import { useEffect, useState } from "react";
import Table from "../components/Table";
import type { Client, Order, Product } from "../types";
import { OrderService } from "../services/orderService";
import Form from "../components/Form";
import type { FormField } from "../components/Form";
import { ProductService } from "../services/productService";
import { ClientService } from "../services/clientService";
import OrderDetailsModal from "../components/OrderDetailsModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [details, setDetails] = useState<Order | null>(null);


  const fetchOrders = () => {
    OrderService.findAll()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  };

  const fetchProducts = () => {
    ProductService.findAll().then(res => {
      setProducts(res.data.filter((p: Product) => p.quantity > 0));
    }).catch(err => {
      console.log("Erro Produto: ", err);
      setProducts([]);
    });
  };

  const fetchClients = () => {
    ClientService.findAll().then(res => {
      setClients(res.data.map((c: Client) => c.email));
    }).catch(() => setClients([]));
  };

  useEffect(() => {
    fetchOrders();
    fetchClients();
    fetchProducts();
  }, []);

  const handleSubmit = (order: Order) => {
    if (editing?.id) {
    const mapStatusToBackend: Record<string, string> = {
      pending: "PENDENTE",
      shipped: "ENVIADO",
      delivered: "ENTREGUE",
      canceled: "CANCELADO",
    };

    const payload = {
      clientEmail: order.clientEmail,
      products: order.products.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
      })),
      status: mapStatusToBackend[order.status ?? "pending"],
    };

    console.log("Payload de update:", payload);

    OrderService.update(editing.id, payload)
      .then(() => {
        fetchOrders();
        setEditing(null);
      })
      .catch(err => console.log("ERRO DO BACKEND:", err.response?.data));
    } else {
      const payload = {
        clientEmail: order.clientEmail,
        products: order.products,
      };
      OrderService.create(payload).then(() => {
        fetchOrders();
        setEditing(null);
      }).catch(err => console.log(err));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente deletar?")) {
      OrderService.delete(id).then(success => {
        if (success) fetchOrders();
      });
    }
  };

  const initialFormValues: Order = editing
    ? {
        clientEmail: editing.clientEmail,
        products: editing.products.map(p => {
          // se o produto não existir mais no estoque, ainda mantém
          const existingProduct = products.find(prod => prod.name === p.name);
          return existingProduct ? { name: existingProduct.name, quantity: p.quantity } : p;
        }),
        status: editing.status ?? "pending",
      }
    : {
        clientEmail: clients.length > 0 ? clients[0] : "",
        products: products.length > 0 ? [{ name: products[0].name, quantity: 1 }] : [{ name: "", quantity: 0 }],
        status: undefined,
      };

  const fields: FormField<Order>[] = [
    { name: "clientEmail", label: "Email do Cliente", type: "select", options: clients.map(email => ({ label: email, value: email })) },
    ...(editing
      ? [
          {
            name: "status",
            label: "Status do Pedido",
            type: "select",
            options: [
              { value: "pending", label: "Pendente" },
              { value: "shipped", label: "Enviado" },
              { value: "delivered", label: "Entregue" },
              { value: "canceled", label: "Cancelado" },
            ],
          } as FormField<Order>,
        ]
      : []),
    { name: "products", label: "Produtos", type: "product-list", options: products.map(p => ({ label: p.name, value: p.name })) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      <Form<Order>
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
        submitLabel={editing ? "Atualizar Pedido" : "Criar Pedido"}
        fields={fields}
      />

      <Table
        data={orders}
        columns={[
          { key: "id", label: "ID" },
          { key: "clientEmail", label: "Cliente" },
          { key: "status", label: "Status" },
        ]}
        actions={(item) => (
          <div className="flex gap-2">
            <button
              className="bg-yellow-500 px-2 rounded"
              onClick={() => setEditing(item)}
            >
              Editar
            </button>
            <button
              className="bg-yellow-400 px-2 rounded"
              onClick={() => setDetails(item)}
            >
              Detalhes
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

    {details && (
      <OrderDetailsModal
        order={details}
        onClose={() => setDetails(null)}
      />
    )}
    </div>
  );
}
