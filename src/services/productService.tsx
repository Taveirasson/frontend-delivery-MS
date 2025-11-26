import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/v1/stock" });

export const ProductService = {
  create: (data: { name: string; quantity: number }) => api.post("", data),
  findAll: () => api.get(""),
  update: (id: string, data: any) => api.put(`/${id}`, data),
  delete: (id: string) => api.delete(`/${id}`)
};
