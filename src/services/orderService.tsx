import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8081/api/v1/order" });

export const OrderService = {
  create: (data: any) => api.post("", data),
  findAll: () => api.get(""),
  findByEmail: (email: string) => api.get(`/historic/byEmail/${email}`),
  findById: (id: string) => api.get(`/historic/byId/${id}`),
  update: (id: string, data: any) => api.put(`/update/${id}`, data),
  delete: (id: string) => api.delete(`/${id}`)
};
