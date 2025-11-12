import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

/**
 * @component Dashboard
 * @description Página principal do dashboard após login
 */
const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Sistema de Gestão</h1>
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="welcome-section">
                    <h2>Bem-vindo, {user?.name}! </h2>
                    <p>Este é o seu painel de controle</p>
                </div>

                {/* Cards de Estatísticas */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👨‍🎓</div>
                        <div className="stat-content">
                            <h3>Alunos</h3>
                            <p className="stat-number">245</p>
                            <span className="stat-label">Total cadastrados</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <h3>Turmas</h3>
                            <p className="stat-number">12</p>
                            <span className="stat-label">Turmas ativas</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <h3>Avaliações</h3>
                            <p className="stat-number">38</p>
                            <span className="stat-label">Este mês</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>Aproveitamento</h3>
                            <p className="stat-number">87%</p>
                            <span className="stat-label">Média geral</span>
                        </div>
                    </div>
                </div>

                {/* Atividades Recentes */}
                <div className="recent-section">
                    <h3>Atividades Recentes</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">📄</div>
                            <div className="activity-content">
                                <p className="activity-title">Nova avaliação criada</p>
                                <span className="activity-time">Há 2 horas</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">👤</div>
                            <div className="activity-content">
                                <p className="activity-title">5 novos alunos cadastrados</p>
                                <span className="activity-time">Há 4 horas</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">📊</div>
                            <div className="activity-content">
                                <p className="activity-title">Relatório mensal gerado</p>
                                <span className="activity-time">Ontem</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
