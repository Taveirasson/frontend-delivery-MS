import { useEffect } from "react";
import type { Order } from "../types";

interface Props {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: Props) {

  // Fecha ao clicar ESC
  useEffect(() => {
    const escListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escListener);
    return () => window.removeEventListener("keydown", escListener);
  }, []);

  if (!order) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // clique fora fecha
    >
      <div
        className="bg-white p-6 rounded shadow-md w-[400px]"
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        <h2 className="text-xl font-bold mb-4">Detalhes do Pedido</h2>

        <p><strong>ID:</strong> {order.id}</p>
        <p><strong>Cliente:</strong> {order.clientEmail}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Produtos:</h3>
        <ul className="space-y-1">
          {order.products.map((p, i) => (
            <li key={i}>
              <strong>{p.name}</strong> — {p.quantity} unidade(s)
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
