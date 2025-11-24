import axios from "axios";
import type { Client } from "../types";

const api = axios.create({ baseURL: "http://localhost:8082/api/v1/client" });

export const ClientService = {
  create: (data: Client) => api.post("", data),
  findAll: () => api.get(""),
  findById: (id: string) => api.get(`/${id}`),
  updateById: (id: string, data: any) => api.put(`/${id}`, data),
  delete: (id: string) => api.delete(`/${id}`)
};