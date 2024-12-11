/* eslint-disable react/prop-types */
import { Modal, Card, Typography, Tooltip, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EventoService from '../services/EventoService';
import '../styles/ListEventModal.css';
import AuthService from "../services/AuthService";

const { Text, Title } = Typography;

const ListEventModal = ({ open, onCancel, events, onEdit, onDelete }) => {
    
    const userLoggedIn = AuthService.getCurrentUser();
    const isAdmin = userLoggedIn.tipo === "ADMIN";

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleDelete = async (eventId) => {
        try {
            await EventoService.deleteEvento(eventId);
            onDelete(eventId);
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
            message.error('Erro ao excluir evento. Tente novamente.', 3);
        }
    };

    return (
        <Modal
            open={open}
            title="Eventos do Dia"
            onCancel={onCancel}
            footer={null}
            className="list-event-modal"
        >
             {events.map((event, index) => (
                <Card key={index} style={{ marginBottom: '1rem', borderLeft: `4px solid ${event.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <Title level={4} style={{ margin: 0 }}>{event.nome}</Title>

                        {/* Verificação para renderizar os ícones apenas para administradores */}
                        {isAdmin && (
                            <div className="btn-container" style={{ marginLeft: 'auto' }}>
                                <Tooltip title="Editar">
                                    <EditOutlined
                                        style={{ color: '#1299E5', cursor: 'pointer', marginRight: '0.5rem' }}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onEdit(event); 
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="Excluir">
                                    <DeleteOutlined
                                        style={{ color: 'red', cursor: 'pointer', marginRight: '0.5rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(event.id);
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        )}
                    </div>

                    <Text type="secondary">Data: {formatDate(event.data)}</Text><br />
                    <Text type="secondary">Hora de Início: {formatTime(event.horaInicio)}</Text><br />
                    <Text type="secondary">Hora de Fim: {formatTime(event.horaFim)}</Text><br />
                    <Text>{event.descricao}</Text>
                </Card>
            ))}
        </Modal>
    );
};

export default ListEventModal;
