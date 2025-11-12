import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '../types/User';
// O authService lidará com a chamada API real (mock ou real)
// import { authService } from '../services/authService';

// Criando o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @provider AuthProvider
 * @description Provê o estado de autenticação e funções para a aplicação.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Lógica para verificar o token no localStorage ao carregar
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    /**
     * @function login
     * @description Autentica o usuário, salva o token e o usuário no estado/localStorage.
     */
    const login = async (email: string, password: string) => {
        // Lógica de simulação (Mock)
        // Substituir pela chamada real: const { user, token } = await authService.login(email, password);
        if (email === 'professor@g.com' && password === '1234') {
            const mockUser: User = {
                id: '1',
                email: 'professor@g.com',
                name: 'Professor Doutor',
            };
            const mockToken = 'fake-jwt-token'; // Simulação do JWT

            setToken(mockToken);
            setUser(mockUser);
            localStorage.setItem('authToken', mockToken);
            localStorage.setItem('authUser', JSON.stringify(mockUser));
        } else {
            throw new Error('Credenciais inválidas');
        }
    };

    /**
     * @function logout
     * @description Remove o token e o usuário, limpando o estado de autenticação.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{ user, token, isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para consumir o contexto
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};