import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Avaliacoes.css';

interface Criterio {
    id: string;
    nome: string;
    peso: number;
}

interface ConfiguracaoTurma {
    id: string;
    turma: string;
    criterios: Criterio[];
}

const configuracoesIniciais: ConfiguracaoTurma[] = [
    {
        id: '1',
        turma: 'Turma A',
        criterios: [
            { id: '1', nome: 'Prova 1', peso: 30 },
            { id: '2', nome: 'Prova 2', peso: 30 },
            { id: '3', nome: 'Trabalho', peso: 25 },
            { id: '4', nome: 'Participação', peso: 15 },
        ],
    },
    {
        id: '2',
        turma: 'Turma B',
        criterios: [
            { id: '1', nome: 'Avaliação 1', peso: 40 },
            { id: '2', nome: 'Avaliação 2', peso: 40 },
            { id: '3', nome: 'Atividades', peso: 20 },
        ],
    },
];

const turmasDisponiveis = ['Turma A', 'Turma B', 'Turma C'];

const Avaliacoes: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [configuracoes, setConfiguracoes] = useState<ConfiguracaoTurma[]>(configuracoesIniciais);
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>('Turma A');
    const [showModal, setShowModal] = useState(false);
    const [editingCriterio, setEditingCriterio] = useState<Criterio | null>(null);
    const [formData, setFormData] = useState({ nome: '', peso: 0 });
    const [error, setError] = useState('');

    // Obter configuração da turma selecionada
    const configuracaoAtual = useMemo(() => {
        return configuracoes.find(c => c.turma === turmaSelecionada);
    }, [configuracoes, turmaSelecionada]);

    // Calcular soma dos pesos
    const somaTotal = useMemo(() => {
        return configuracaoAtual?.criterios.reduce((sum, c) => sum + c.peso, 0) || 0;
    }, [configuracaoAtual]);

    // Verificar se a soma está correta
    const pesoValido = somaTotal === 100;
    const pesoExcedido = somaTotal > 100;
    const pesoInsuficiente = somaTotal < 100;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openModal = (criterio?: Criterio) => {
        if (criterio) {
            setEditingCriterio(criterio);
            setFormData({ nome: criterio.nome, peso: criterio.peso });
        } else {
            setEditingCriterio(null);
            setFormData({ nome: '', peso: 0 });
        }
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCriterio(null);
        setFormData({ nome: '', peso: 0 });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.nome || formData.peso <= 0) {
            setError('Nome e peso são obrigatórios');
            return;
        }

        // Calcular a nova soma
        let novaSoma = somaTotal;
        if (editingCriterio) {
            novaSoma = novaSoma - editingCriterio.peso + formData.peso;
        } else {
            novaSoma = novaSoma + formData.peso;
        }

        if (novaSoma > 100) {
            setError(`A soma dos pesos ficaria ${novaSoma}%. O máximo permitido é 100%.`);
            return;
        }

        setConfiguracoes(configuracoes.map(config => {
            if (config.turma === turmaSelecionada) {
                if (editingCriterio) {
                    return {
                        ...config,
                        criterios: config.criterios.map(c =>
                            c.id === editingCriterio.id ? { ...c, ...formData } : c
                        ),
                    };
                } else {
                    const novoCriterio: Criterio = {
                        id: Date.now().toString(),
                        ...formData,
                    };
                    return {
                        ...config,
                        criterios: [...config.criterios, novoCriterio],
                    };
                }
            }
            return config;
        }));

        closeModal();
    };

    const handleDelete = (criterioId: string) => {
        if (window.confirm('Tem certeza que deseja remover este critério?')) {
            setConfiguracoes(configuracoes.map(config => {
                if (config.turma === turmaSelecionada) {
                    return {
                        ...config,
                        criterios: config.criterios.filter(c => c.id !== criterioId),
                    };
                }
                return config;
            }));
        }
    };

    const handlePesoChange = (criterioId: string, novoPeso: number) => {
        if (novoPeso < 0) return;

        setConfiguracoes(configuracoes.map(config => {
            if (config.turma === turmaSelecionada) {
                return {
                    ...config,
                    criterios: config.criterios.map(c =>
                        c.id === criterioId ? { ...c, peso: novoPeso } : c
                    ),
                };
            }
            return config;
        }));
    };

    const criarNovaTurma = () => {
        const novaTurma = prompt('Digite o nome da nova turma:');
        if (novaTurma && !configuracoes.find(c => c.turma === novaTurma)) {
            setConfiguracoes([
                ...configuracoes,
                {
                    id: Date.now().toString(),
                    turma: novaTurma,
                    criterios: [],
                },
            ]);
            setTurmaSelecionada(novaTurma);
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
                        <h2>Configuração de Avaliações</h2>
                        <p>Configure os critérios de avaliação para cada turma</p>
                    </div>
                </div>

                {/* Seleção de Turma */}
                <div className="turma-selector-section">
                    <div className="selector-group">
                        <label>Selecione a Turma:</label>
                        <select
                            value={turmaSelecionada}
                            onChange={(e) => setTurmaSelecionada(e.target.value)}
                            className="turma-select"
                        >
                            {configuracoes.map(config => (
                                <option key={config.id} value={config.turma}>
                                    {config.turma}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={criarNovaTurma} className="btn-secondary">
                        + Nova Turma
                    </button>
                </div>

                {/* Indicador de Peso */}
                <div className={`peso-indicator ${pesoValido ? 'valid' : pesoExcedido ? 'exceeded' : 'insufficient'}`}>
                    <div className="peso-header">
                        <span className="peso-label">Soma Total dos Pesos:</span>
                        <span className="peso-value">{somaTotal}%</span>
                    </div>
                    <div className="peso-bar">
                        <div
                            className="peso-fill"
                            style={{ width: `${Math.min(somaTotal, 100)}%` }}
                        ></div>
                    </div>
                    {!pesoValido && (
                        <div className="peso-message">
                            {pesoExcedido && (
                                <>
                                    ⚠️ A soma dos pesos excede 100% em {somaTotal - 100}%
                                </>
                            )}
                            {pesoInsuficiente && (
                                <>
                                    ⚠️ Faltam {100 - somaTotal}% para completar 100%
                                </>
                            )}
                        </div>
                    )}
                    {pesoValido && (
                        <div className="peso-message success">
                            ✓ Configuração válida! A soma dos pesos é 100%
                        </div>
                    )}
                </div>

                {/* Lista de Critérios */}
                <div className="criterios-section">
                    <div className="section-header">
                        <h3>Critérios de Avaliação</h3>
                        <button onClick={() => openModal()} className="btn-primary">
                            + Adicionar Critério
                        </button>
                    </div>

                    {!configuracaoAtual || configuracaoAtual.criterios.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📋</span>
                            <h3>Nenhum critério configurado</h3>
                            <p>Adicione critérios de avaliação para esta turma</p>
                        </div>
                    ) : (
                        <div className="criterios-list">
                            {configuracaoAtual.criterios.map((criterio, index) => (
                                <div key={criterio.id} className="criterio-card">
                                    <div className="criterio-number">{index + 1}</div>
                                    <div className="criterio-content">
                                        <div className="criterio-info">
                                            <h4>{criterio.nome}</h4>
                                            <div className="criterio-peso-control">
                                                <label>Peso:</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={criterio.peso}
                                                    onChange={(e) =>
                                                        handlePesoChange(criterio.id, parseFloat(e.target.value) || 0)
                                                    }
                                                    className="peso-input"
                                                />
                                                <span className="peso-unit">%</span>
                                            </div>
                                        </div>
                                        <div className="criterio-visual">
                                            <div className="criterio-bar">
                                                <div
                                                    className="criterio-bar-fill"
                                                    style={{ width: `${criterio.peso}%` }}
                                                >
                                                    <span className="criterio-bar-label">
                                                        {criterio.peso}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="criterio-actions">
                                            <button
                                                onClick={() => openModal(criterio)}
                                                className="btn-edit"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(criterio.id)}
                                                className="btn-delete"
                                                title="Remover"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingCriterio ? 'Editar Critério' : 'Novo Critério'}</h3>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome do Critério *</label>
                                <input
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    placeholder="Ex: Prova 1, Trabalho, Participação"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Peso Percentual (%) *</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    max="100"
                                    step="0.01"
                                    value={formData.peso}
                                    onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })}
                                    placeholder="0"
                                    required
                                />
                                <small className="form-hint">
                                    Peso disponível: {100 - somaTotal + (editingCriterio?.peso || 0)}%
                                </small>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Avaliacoes;
