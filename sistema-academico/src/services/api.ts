import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Definir a URL base da API (pode vir de variáveis de ambiente)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * @instance api
 * @description Instância centralizada do Axios para a aplicação.
 */
const api = axios.create({
    baseURL: API_BASE_URL,
});

/**
 * @interceptor request
 * @description Intercepta todas as requisições para anexar o token JWT.
 * Lê o token do localStorage, pois esta camada de serviço
 * não deve depender de hooks (React Context).
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Futuramente, interceptors de *resposta* podem ser adicionados
// aqui para tratar erros globais (ex: 401 Unauthorized, 403 Forbidden).

export default api;