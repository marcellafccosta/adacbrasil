import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import '../styles/Voluntarios.css';
import AuthService from "../services/AuthService";

const { confirm } = Modal;

const VolunteerComponent = ({ searchText }) => {
    const [voluntarios, setVoluntarios] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userLoggedIn = AuthService.getCurrentUser();
    const isAdmin = userLoggedIn.tipo === "ADMIN";

    useEffect(() => {
        const fetchVoluntarios = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/usuario/voluntarios');
                setVoluntarios(response.data);
                setFilteredVolunteers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erro ao buscar voluntários. Tente novamente mais tarde.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchVoluntarios();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/usuario/${id}/voluntario`);
            setVoluntarios((prevVoluntarios) =>
                prevVoluntarios.filter((voluntario) => voluntario.id !== id)
            );
            window.location.reload()
        } catch (error) {
            console.error('Erro ao deletar voluntário', error);
        }
    };

    const showDeleteConfirm = (id, name) => {
        confirm({
            title: 'Deletar Voluntário',
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            content: (
                <div>
                    <p>Tem certeza que deseja excluir este voluntário?</p>
                    <p><strong>Nome:</strong> {name}</p>
                </div>
            ),
            okText: 'Sim, deletar',
            okType: 'danger',
            cancelText: 'Cancelar',
            className: 'custom-confirm-modal',
            onOk() {
                handleDelete(id);
            },
            onCancel() {
                console.log('Cancelado');
            },
        });
    };

    useEffect(() => {
        const filtered = voluntarios.filter((volunteer) =>
            volunteer.usuario.nome.toLowerCase().startsWith(searchText.toLowerCase())
        );
        setFilteredVolunteers(filtered);
    }, [searchText, voluntarios]);

    return (
        <div className="grid">
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                filteredVolunteers.map((voluntario) => (
                    <div key={voluntario.id} className="volunteer-card">
                        <div className="volunteer-info">
                            <h2 className="volunteer-name">{voluntario.usuario.nome}</h2>
                            <p className="volunteer-email">{voluntario.usuario.email}</p>
                            <p><strong>Disponibilidade:</strong> {voluntario.tempoDisponivel}</p>
                            <p><strong>Profissão:</strong> {voluntario.profissao}</p>
                            <p><strong>Contribuições:</strong> {voluntario.contribuicoes}</p>
                        </div>

                        <div className="actions">
                            {isAdmin && (
                            <button
                                className="delete-button"
                                onClick={() => showDeleteConfirm(voluntario.usuarioId, voluntario.usuario.nome)}
                            >
                                <DeleteOutlined /> Apagar
                            </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default VolunteerComponent;
