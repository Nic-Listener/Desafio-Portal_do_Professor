import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Importação de páginas (ex: lazy loading)
const Login = React.lazy(() => import('./pages/Login')); 
const Dashboard = React.lazy(() => import('./pages/Dashboard')); 
const Alunos = React.lazy(() => import('./pages/Alunos'));
const Turmas = React.lazy(() => import('./pages/Turmas'));
const Avaliacoes = React.lazy(() => import('./pages/Avaliacoes'));

/**
 * @component AppRoutes
 * @description Define a estrutura de roteamento da aplicação,
 * incluindo rotas públicas e protegidas.
 */
const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <React.Suspense fallback={<div>Carregando...</div>}>
            <Routes>
                {/* Rota Pública - Login */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
                    }
                />

                {/* Rotas Protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    { <Route path="/alunos" element={<Alunos />} /> }
                    { <Route path="/turmas" element={<Turmas />} /> }/
                    { <Route path="/avaliacoes" element={<Avaliacoes />} /> }
                </Route>

                {/* Rota Padrão */}
                <Route
                    path="*"
                    element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
                />
            </Routes>
        </React.Suspense>
    );
};

/**
 * @component App
 * @description Componente raiz que envolve a aplicação
 * com provedores globais (Tema, Autenticação).
 */
const App: React.FC = () => {
    // Aqui também entraria o ThemeProvider do MUI
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;