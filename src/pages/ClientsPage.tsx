import { useEffect, useState } from "react";
// import { ClientService } from "../services/clientService";
import Table from "../components/Table";
import Form from "../components/Form";
import { MockClientService } from "../services/mockService";
import type { Client } from "../types";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Client | null>(null);

  const fetchClients = () => MockClientService.findAll().then(res => setClients(res));

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = (client: Client) => {
    if (editing?.id) {
      MockClientService.updateById(editing.id, client).then(() => {
        setClients(prev => prev.map(c => c.id === editing.id ? { ...c, ...client } : c));
        fetchClients();
        setEditing(null);
      });
    } else {
      MockClientService.create(client).then((newClient) => {
        setClients(prev => [...prev, newClient]); 
        fetchClients();
        setEditing(null);  
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente deletar?")) {
      MockClientService.deleteById(id).then((success) => {
        if (success ){
          setClients(clients.filter(c => c.id !== id));
          fetchClients();
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clientes</h1>

      <Form
        key={editing ? editing.id : "new"}
        initialValues={editing ?? { name: "", email: "" }}
        onSubmit={handleSubmit}
        fields={[{ name: "name", label: "Nome" }, { name: "email", label: "Email" }]}
        submitLabel={editing ? "Atualizar" : "Criar"}
      />

      <Table
        data={clients}
        columns={[{ key: "name", label: "Nome" }, { key: "email", label: "Email" }]}
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
