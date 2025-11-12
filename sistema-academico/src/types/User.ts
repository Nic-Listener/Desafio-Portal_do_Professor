/**
 * @interface User
 * @description Define a estrutura do objeto de usuário autenticado.
 */
export interface User {
    id: string;
    email: string;
    name: string;
}

/**
 * @interface AuthContextType
 * @description Define a API do contexto de autenticação,
 * incluindo o estado e as funções de login/logout.
 */
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}