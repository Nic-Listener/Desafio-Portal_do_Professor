import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Alunos.css';

interface Aluno {
    id: string;
    nome: string;
    email: string;
    turma: string;
    status: 'Ativo' | 'Inativo';
}

const alunosIniciais: Aluno[] = [
    { id: '1', nome: 'João Silva', email: 'joao@email.com', turma: 'Turma A', status: 'Ativo' },
    { id: '2', nome: 'Maria Santos', email: 'maria@email.com', turma: 'Turma B', status: 'Ativo' },
    { id: '3', nome: 'Pedro Costa', email: 'pedro@email.com', turma: 'Turma A', status: 'Inativo' },
    { id: '4', nome: 'Ana Oliveira', email: 'ana@email.com', turma: 'Turma C', status: 'Ativo' },
];

const Alunos: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTurma, setFilterTurma] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        turma: '',
        status: 'Ativo' as 'Ativo' | 'Inativo',
    });
    const [error, setError] = useState('');

    // Filtrar alunos
    const alunosFiltrados = useMemo(() => {
        return alunos.filter((aluno) => {
            const matchSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                aluno.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchTurma = !filterTurma || aluno.turma === filterTurma;
            const matchStatus = !filterStatus || aluno.status === filterStatus;
            return matchSearch && matchTurma && matchStatus;
        });
    }, [alunos, searchTerm, filterTurma, filterStatus]);

    // Obter turmas únicas
    const turmasDisponiveis = useMemo(() => {
        return Array.from(new Set(alunos.map(a => a.turma)));
    }, [alunos]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openModal = (aluno?: Aluno) => {
        if (aluno) {
            setEditingAluno(aluno);
            setFormData({
                nome: aluno.nome,
                email: aluno.email,
                turma: aluno.turma,
                status: aluno.status,
            });
        } else {
            setEditingAluno(null);
            setFormData({ nome: '', email: '', turma: '', status: 'Ativo' });
        }
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAluno(null);
        setFormData({ nome: '', email: '', turma: '', status: 'Ativo' });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.nome || !formData.email || !formData.turma) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (editingAluno) {
                setAlunos(alunos.map(a => 
                    a.id === editingAluno.id ? { ...a, ...formData } : a
                ));
            } else {
                const novoAluno: Aluno = {
                    id: Date.now().toString(),
                    ...formData,
                };
                setAlunos([...alunos, novoAluno]);
            }
            setLoading(false);
            closeModal();
        }, 500);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja remover este aluno?')) {
            setLoading(true);
            setTimeout(() => {
                setAlunos(alunos.filter(a => a.id !== id));
                setLoading(false);
            }, 500);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-content">
                    <h1>Sistema de Gestão</h1>
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                    </div>
                </div>
            </header>

            <main className="page-main">
                <div className="page-header-section">
                    <div>
                        <h2>Gestão de Alunos</h2>
                        <p>Gerencie os alunos cadastrados no sistema</p>
                    </div>
                    <button onClick={() => openModal()} className="btn-primary">
                        + Novo Aluno
                    </button>
                </div>

                {/* Filtros */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nome ou e-mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            value={filterTurma}
                            onChange={(e) => setFilterTurma(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todas as Turmas</option>
                            {turmasDisponiveis.map(turma => (
                                <option key={turma} value={turma}>{turma}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todos os Status</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                        {(searchTerm || filterTurma || filterStatus) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterTurma('');
                                    setFilterStatus('');
                                }}
                                className="btn-clear"
                            >
                                Limpar Filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabela */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Carregando...</p>
                    </div>
                ) : alunosFiltrados.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <h3>Nenhum aluno encontrado</h3>
                        <p>
                            {searchTerm || filterTurma || filterStatus
                                ? 'Tente ajustar os filtros de busca'
                                : 'Comece cadastrando um novo aluno'}
                        </p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Turma</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alunosFiltrados.map((aluno) => (
                                    <tr key={aluno.id}>
                                        <td>{aluno.nome}</td>
                                        <td>{aluno.email}</td>
                                        <td>{aluno.turma}</td>
                                        <td>
                                            <span className={`status-badge ${aluno.status.toLowerCase()}`}>
                                                {aluno.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => openModal(aluno)}
                                                    className="btn-edit"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(aluno.id)}
                                                    className="btn-delete"
                                                    title="Remover"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingAluno ? 'Editar Aluno' : 'Novo Aluno'}</h3>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome *</label>
                                <input
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    placeholder="Nome completo"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>E-mail *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@exemplo.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Turma *</label>
                                <input
                                    type="text"
                                    value={formData.turma}
                                    onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                                    placeholder="Ex: Turma A"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })}
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alunos;
