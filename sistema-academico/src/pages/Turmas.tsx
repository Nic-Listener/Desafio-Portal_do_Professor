import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Turmas.css';

interface Turma {
    id: string;
    nome: string;
    capacidadeMaxima: number;
    alunosAssociados: string[];
}

interface Aluno {
    id: string;
    nome: string;
    email: string;
}

const turmasIniciais: Turma[] = [
    { id: '1', nome: 'Turma A', capacidadeMaxima: 30, alunosAssociados: ['1', '3'] },
    { id: '2', nome: 'Turma B', capacidadeMaxima: 25, alunosAssociados: ['2'] },
    { id: '3', nome: 'Turma C', capacidadeMaxima: 35, alunosAssociados: ['4'] },
];

const alunosDisponiveis: Aluno[] = [
    { id: '1', nome: 'João Silva', email: 'joao@email.com' },
    { id: '2', nome: 'Maria Santos', email: 'maria@email.com' },
    { id: '3', nome: 'Pedro Costa', email: 'pedro@email.com' },
    { id: '4', nome: 'Ana Oliveira', email: 'ana@email.com' },
    { id: '5', nome: 'Carlos Souza', email: 'carlos@email.com' },
];

const Turmas: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [turmas, setTurmas] = useState<Turma[]>(turmasIniciais);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAlunosModal, setShowAlunosModal] = useState(false);
    const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
    const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        capacidadeMaxima: 30,
    });
    const [error, setError] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openModal = (turma?: Turma) => {
        if (turma) {
            setEditingTurma(turma);
            setFormData({
                nome: turma.nome,
                capacidadeMaxima: turma.capacidadeMaxima,
            });
        } else {
            setEditingTurma(null);
            setFormData({ nome: '', capacidadeMaxima: 30 });
        }
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTurma(null);
        setFormData({ nome: '', capacidadeMaxima: 30 });
        setError('');
    };

    const openAlunosModal = (turma: Turma) => {
        setSelectedTurma(turma);
        setShowAlunosModal(true);
    };

    const closeAlunosModal = () => {
        setShowAlunosModal(false);
        setSelectedTurma(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.nome || formData.capacidadeMaxima < 1) {
            setError('Preencha todos os campos corretamente');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (editingTurma) {
                setTurmas(turmas.map(t => 
                    t.id === editingTurma.id 
                        ? { ...t, nome: formData.nome, capacidadeMaxima: formData.capacidadeMaxima } 
                        : t
                ));
            } else {
                const novaTurma: Turma = {
                    id: Date.now().toString(),
                    nome: formData.nome,
                    capacidadeMaxima: formData.capacidadeMaxima,
                    alunosAssociados: [],
                };
                setTurmas([...turmas, novaTurma]);
            }
            setLoading(false);
            closeModal();
        }, 500);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja remover esta turma?')) {
            setLoading(true);
            setTimeout(() => {
                setTurmas(turmas.filter(t => t.id !== id));
                setLoading(false);
            }, 500);
        }
    };

    const toggleAlunoAssociacao = (alunoId: string) => {
        if (!selectedTurma) return;

        setTurmas(turmas.map(t => {
            if (t.id === selectedTurma.id) {
                const jaAssociado = t.alunosAssociados.includes(alunoId);
                return {
                    ...t,
                    alunosAssociados: jaAssociado
                        ? t.alunosAssociados.filter(id => id !== alunoId)
                        : [...t.alunosAssociados, alunoId]
                };
            }
            return t;
        }));

        setSelectedTurma(prev => {
            if (!prev) return null;
            const jaAssociado = prev.alunosAssociados.includes(alunoId);
            return {
                ...prev,
                alunosAssociados: jaAssociado
                    ? prev.alunosAssociados.filter(id => id !== alunoId)
                    : [...prev.alunosAssociados, alunoId]
            };
        });
    };

    const getNomeAluno = (id: string) => {
        return alunosDisponiveis.find(a => a.id === id)?.nome || 'Desconhecido';
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
                        <h2>Gestão de Turmas</h2>
                        <p>Gerencie as turmas e associe alunos</p>
                    </div>
                    <button onClick={() => openModal()} className="btn-primary">
                        + Nova Turma
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Carregando...</p>
                    </div>
                ) : turmas.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🏫</span>
                        <h3>Nenhuma turma cadastrada</h3>
                        <p>Comece criando uma nova turma</p>
                    </div>
                ) : (
                    <div className="turmas-grid">
                        {turmas.map((turma) => (
                            <div key={turma.id} className="turma-card">
                                <div className="turma-header">
                                    <h3>{turma.nome}</h3>
                                    <div className="turma-actions">
                                        <button
                                            onClick={() => openModal(turma)}
                                            className="btn-icon"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(turma.id)}
                                            className="btn-icon"
                                            title="Remover"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="turma-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Capacidade</span>
                                        <span className="stat-value">{turma.capacidadeMaxima}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Alunos</span>
                                        <span className="stat-value">{turma.alunosAssociados.length}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Vagas</span>
                                        <span className="stat-value">
                                            {turma.capacidadeMaxima - turma.alunosAssociados.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="turma-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(turma.alunosAssociados.length / turma.capacidadeMaxima) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">
                                        {Math.round((turma.alunosAssociados.length / turma.capacidadeMaxima) * 100)}% ocupado
                                    </span>
                                </div>
                                <button
                                    onClick={() => openAlunosModal(turma)}
                                    className="btn-secondary btn-full"
                                >
                                    👥 Gerenciar Alunos
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Criar/Editar Turma */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingTurma ? 'Editar Turma' : 'Nova Turma'}</h3>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome da Turma *</label>
                                <input
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    placeholder="Ex: Turma A"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Capacidade Máxima *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.capacidadeMaxima}
                                    onChange={(e) => setFormData({ ...formData, capacidadeMaxima: parseInt(e.target.value) || 0 })}
                                    placeholder="30"
                                    required
                                />
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

            {/* Modal Associar Alunos */}
            {showAlunosModal && selectedTurma && (
                <div className="modal-overlay" onClick={closeAlunosModal}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Alunos - {selectedTurma.nome}</h3>
                            <button onClick={closeAlunosModal} className="modal-close">×</button>
                        </div>
                        <p className="modal-subtitle">
                            {selectedTurma.alunosAssociados.length} de {selectedTurma.capacidadeMaxima} vagas ocupadas
                        </p>
                        <div className="alunos-list">
                            {alunosDisponiveis.map((aluno) => {
                                const isAssociado = selectedTurma.alunosAssociados.includes(aluno.id);
                                const isFull = selectedTurma.alunosAssociados.length >= selectedTurma.capacidadeMaxima;
                                
                                return (
                                    <div key={aluno.id} className="aluno-item">
                                        <div className="aluno-info">
                                            <span className="aluno-name">{aluno.nome}</span>
                                            <span className="aluno-email">{aluno.email}</span>
                                        </div>
                                        <button
                                            onClick={() => toggleAlunoAssociacao(aluno.id)}
                                            className={`btn-toggle ${isAssociado ? 'active' : ''}`}
                                            disabled={!isAssociado && isFull}
                                        >
                                            {isAssociado ? '✓ Associado' : isFull ? 'Turma Cheia' : '+ Associar'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="modal-actions">
                            <button onClick={closeAlunosModal} className="btn-primary">
                                Concluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Turmas;
