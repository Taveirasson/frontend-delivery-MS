import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-6">
      <Link to="/" className="hover:text-blue-400">Clientes</Link>
      <Link to="/products" className="hover:text-blue-400">Produtos</Link>
      <Link to="/orders" className="hover:text-blue-400">Pedidos</Link>
    </nav>
  );
}
