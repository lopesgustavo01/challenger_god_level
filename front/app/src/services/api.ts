import axios from "axios"

// Base URL da sua API
export const api = axios.create({
  baseURL: "http://localhost:3333/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptores podem ser adicionados aqui (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error)
    return Promise.reject(error)
  }
)

