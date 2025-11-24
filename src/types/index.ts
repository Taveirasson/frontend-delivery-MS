export type Client = {
    id?: string;
    name: string;
    email: string;
  };
  
  export type Product = {
    id?: string;
    name: string;
    quantity: number;
  };

  
  export type Order = {
    id?: string;
    clientEmail: string;
    products: Product[];
    status?: "pending" | "shipped" | "delivered" | "canceled";
    createdAt?: string;
  };