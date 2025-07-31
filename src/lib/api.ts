// src/lib/api.ts
import axios from "axios";

// Cria uma instância customizada do Axios
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
