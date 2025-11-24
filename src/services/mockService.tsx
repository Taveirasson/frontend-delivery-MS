import type { Client, Product, Order } from "../types";
  
export const mockClients: Client[] = [
    { id: "1", name: "Eduardo", email: "decarli@gmail.com" },
    { id: "2", name: "Rodrigo", email: "rodrigo@gmail.com" },
    { id: "3", name: "Gustavo", email: "gustavo@gmail.com" },
    { id: "4", name: "Lucas", email: "lucas@gmail.com" }
];
  
export const MockClientService = {
    create: (data: Client): Promise<Client> => {
        const newClient = { ...data, id: `${mockClients.length + 1}` };
        mockClients.push(newClient);
        console.log("MockClientService.create:", newClient);
        return Promise.resolve(newClient);
    },
    findAll: (): Promise<Client[]> => Promise.resolve(mockClients),
    findById: (id: string): Promise<Client | undefined> => {
        return Promise.resolve(mockClients.find(c => c.id === id));
    },
    findByEmail: (email: string): Promise<Client | undefined> => {
        return Promise.resolve(mockClients.find(c => c.email === email));
    },
    updateById: (id: string, data: Partial<Client>): Promise<Client | undefined> => {
        const index = mockClients.findIndex(c => c.id === id);
        if (index !== -1) {
        mockClients[index] = { ...mockClients[index], ...data };
        return Promise.resolve(mockClients[index]);
        }
        return Promise.resolve(undefined);
    },
    updateByEmail: (email: string, data: Partial<Client>): Promise<Client | undefined> => {
        const index = mockClients.findIndex(c => c.email === email);
        if (index !== -1) {
        mockClients[index] = { ...mockClients[index], ...data };
        return Promise.resolve(mockClients[index]);
        }
        return Promise.resolve(undefined);
    },
    deleteById: (id: string): Promise<boolean> => {
        const index = mockClients.findIndex(c => c.id === id);
        if (index !== -1) {
        mockClients.splice(index, 1);
        return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
};
  
export const mockProducts: Product[] = [
    { id: "1", name: "computer", quantity: 4 },
    { id: "2", name: "iphone", quantity: 5 },
    { id: "3", name: "refri", quantity: 10 }
];
  
export const MockProductService = {
    create: (data: Product): Promise<Product> => {
      const newProduct = { ...data, id: `p${mockProducts.length + 1}` };
      mockProducts.push(newProduct);
      return Promise.resolve(newProduct);
    },
    findAll: (): Promise<Product[]> => Promise.resolve(mockProducts),
    findById: (id: string): Promise<Product | undefined> => {
      return Promise.resolve(mockProducts.find(p => p.id === id));
    },
    findByName: (name: string): Promise<Product | undefined> => {
      return Promise.resolve(mockProducts.find(p => p.name === name));
    },
    update: (id: string, data: Partial<Product>): Promise<Product | undefined> => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...data };
        return Promise.resolve(mockProducts[index]);
      }
      return Promise.resolve(undefined);
    },
    addQuantity: (name: string, quantity: number): Promise<Product | undefined> => {
      const product = mockProducts.find(p => p.name === name);
      if (product) {
        product.quantity += quantity;
        return Promise.resolve(product);
      }
      return Promise.resolve(undefined);
    },
    removeQuantity: (name: string, quantity: number): Promise<Product | undefined> => {
      const product = mockProducts.find(p => p.name === name);
      if (product) {
        product.quantity = Math.max(0, product.quantity - quantity);
        return Promise.resolve(product);
      }
      return Promise.resolve(undefined);
    },
    deleteById: (id: string): Promise<boolean> => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
};
  
export const mockOrders: Order[] = [
    {
        id: "1",
        clientEmail: "eduardo@gmail.com",
        products: [{ name: "iphone", quantity: 1 }],
        status: "pending",
        createdAt: new Date().toISOString()
    }
];
  
export const MockOrderService = {
    create: (data: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> => {
      const newOrder: Order = {
        ...data,
        id: `o${mockOrders.length + 1}`,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      mockOrders.push(newOrder);
      return Promise.resolve(newOrder);
    },
    findAll: (): Promise<Order[]> => Promise.resolve(mockOrders),
    findByEmail: (email: string): Promise<Order[]> => {
      return Promise.resolve(mockOrders.filter(o => o.clientEmail === email));
    },
    findById: (id: string): Promise<Order | undefined> => {
      return Promise.resolve(mockOrders.find(o => o.id === id));
    },
    update: (id: string, data: Partial<Order>): Promise<Order | undefined> => {
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOrders[index] = { ...mockOrders[index], ...data };
        return Promise.resolve(mockOrders[index]);
      }
      return Promise.resolve(undefined);
    },
    deleteById: (id: string): Promise<boolean> => {
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOrders.splice(index, 1);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
};
  