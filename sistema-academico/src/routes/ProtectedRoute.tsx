import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Supondo que existe um layout principal com sidebar/header
// import MainLayout from '../layouts/MainLayout';

/**
 * @component ProtectedRoute
 * @description Protege rotas que exigem autenticação.
 * Redireciona para /login se não estiver autenticado.
 */
const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redireciona para a página de login, preservando a rota de origem
        return <Navigate to="/login" replace />;
    }

    // Opcional: Envolver rotas protegidas em um layout principal
    // return (
    //     <MainLayout>
    //         <Outlet />
    //     </MainLayout>
    // );

    // Versão simples: apenas renderiza o componente filho (página)
    return <Outlet />;
};

export default ProtectedRoute;