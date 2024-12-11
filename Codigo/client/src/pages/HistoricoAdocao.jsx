import React, { useState, useEffect } from 'react';
import { Card, List, Skeleton, Button, Modal, Input, Form, Select, message } from 'antd';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Menu from '../components/Menu';
import Header from '../components/Header';
import { Divider } from "@mui/material";
import AuthService from '../services/AuthService';


const { Option } = Select;

const HistoricoAdocao = () => {
    const user = AuthService.getCurrentUser();
    const id = user.id;

    const [adocoes, setAdocoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initLoading, setInitLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRespostasModalVisible, setIsRespostasModalVisible] = useState(false);  // Novo estado para modal de respostas
    const [selectedAdocao, setSelectedAdocao] = useState(null);
    const [status, setStatus] = useState(null); // Novo estado para o status
    const userLoggedIn = AuthService.getCurrentUser();
    const isAdmin = userLoggedIn.tipo === "ADMIN";

    const iconStyle = { fontSize: '18px', color: '#041E41' };
    const buttonStyle = { backgroundColor: '#041E41', color: '#fff', float: 'right' };

    const toIsoDateString = (date) => {
        if (!date) return null;
        return new Date(date).toISOString();
    };

    const fetchPetById = async (petId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/pet/${petId}`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const petData = await response.json();
            return petData.nome;
        } catch (error) {
            console.error('Erro ao buscar o nome do pet:', error);
            return 'Desconhecido';
        }
    };

    const fetchAdotanteById = async (usuarioId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/usuario/${usuarioId}`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const adotanteData = await response.json();
            return adotanteData.nome;
        } catch (error) {
            console.error('Erro ao buscar o nome do adotante:', error);
            return 'Desconhecido';
        }
    }

    useEffect(() => {
        const fetchAdocoes = async () => {
            if (!id) {
                console.error('User ID not found!');
                setLoading(false);
                return;
            }

            try {
                const response = isAdmin
                    ? await fetch('http://localhost:3000/api/adocao/')
                    : await fetch(`http://localhost:3000/api/adocao/usuario/${userLoggedIn.id}`);

                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

                const data = await response.json();

                const adocoesComPetNomeEUsuario = await Promise.all(
                    data.map(async (adocao) => {
                        const petNome = await fetchPetById(adocao.petId);
                        const usuarioNome = await fetchAdotanteById(adocao.usuarioId);
                        return { ...adocao, petNome, usuarioNome };
                    })
                );

                setAdocoes(adocoesComPetNomeEUsuario);
            } catch (error) {
                console.error('Error fetching adoptions:', error);
            } finally {
                setLoading(false);
                setInitLoading(false);
            }
        };

        fetchAdocoes();
    }, [id, isAdmin]);

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
    };

    const showModal = (adocao) => {
        setSelectedAdocao(adocao);
        setStatus(adocao.status); // Define o status quando o modal é aberto
        setIsModalVisible(true);
    };

    const showRespostasModal = (adocao) => {
        setSelectedAdocao(adocao);
        setIsRespostasModalVisible(true);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };



    const handleOk = async (values) => {
        if (!selectedAdocao) return;

        try {
            const response = await fetch(`http://localhost:3000/api/adocao/${selectedAdocao.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: values.status,
                    proximoAcompanhamento: toIsoDateString(values.proximoAcompanhamento),
                }),
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const updatedAdocao = { ...selectedAdocao, ...values, proximoAcompanhamento: values.proximoAcompanhamento };
            setAdocoes(adocoes.map(adocao => (adocao.id === selectedAdocao.id ? updatedAdocao : adocao)));

            message.success('Adoção atualizada com sucesso!');
            setIsModalVisible(false);
            setSelectedAdocao(null);
        } catch (error) {
            console.error('Error updating adoption:', error);
            message.error('Erro ao atualizar a adoção.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsRespostasModalVisible(false);
        setSelectedAdocao(null);
    };


    const renderRespostasFormulario = (respostas) => {
        if (!respostas) return 'Nenhuma resposta disponível.';

        // Função para verificar se a resposta está vazia e retornar "N/A" se estiver
        const getResponse = (field) => {
            return field ? field : 'N/A';
        };

        return (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p style={{ marginBottom: '4px' }}><strong>Facebook:</strong> {getResponse(respostas.facebook)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Instagram:</strong> {getResponse(respostas.instagram)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Imóvel:</strong> {getResponse(respostas.imovel)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Tipo de Residência:</strong> {getResponse(respostas.residencia)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Quantas pessoas residem:</strong> {getResponse(respostas.moradores)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Telefone de outro morador:</strong> {getResponse(respostas.telefoneMorador)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Gostam de Animais:</strong> {getResponse(respostas.gostamAnimais)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Aprovação da Adoção:</strong> {getResponse(respostas.aprovacaoAdocao)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Histórico de Pets:</strong> {getResponse(respostas.historicoPets)}</p>
                <p style={{ marginBottom: '4px' }}><strong>O que aconteceu com ele:</strong> {getResponse(respostas.oQueAconteceu)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Histórico de morte de animalzinho:</strong> {getResponse(respostas.historicoMorte)}</p>
                <p style={{ marginBottom: '4px' }}><strong>O que aconteceu com o animal:</strong> {getResponse(respostas.oQueAconteceuMorte)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Ração dada:</strong> {getResponse(respostas.racao)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Disposto a dar ração de qualidade:</strong> {getResponse(respostas.dispostoRacao)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Em qual situação devolveria o animalzinho:</strong> {getResponse(respostas.devolverAnimal)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Conhecimento sobre castração:</strong> {getResponse(respostas.conhecimentoCastração)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Está disposto(a) a vacinar anualmente:</strong> {getResponse(respostas.vacinarAnualmente)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Compromete-se a castrar:</strong> {getResponse(respostas.comprometeCastrar)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Tem clínica veterinária próxima:</strong> {getResponse(respostas.clinicaVeterinaria)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Nome da clínica:</strong> {getResponse(respostas.nomeClinica)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Conhecimento sobre vacinas:</strong> {getResponse(respostas.conhecimentoVacinas)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Quais vacinas:</strong> {getResponse(respostas.quaisVacinas)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Atitude em caso de perigo:</strong> {getResponse(respostas.atitudePerigo)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Desejo de ter um animal:</strong> {getResponse(respostas.desejoAnimal)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Condição financeira para ração premium:</strong> {getResponse(respostas.condicaoFinanceira)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Se importaria de enviar fotos/vídeos do animal:</strong> {getResponse(respostas.enviarFotos)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Animal será criado dentro de casa:</strong> {getResponse(respostas.criadoDentroDeCasa)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Onde o animal vai dormir:</strong> {getResponse(respostas.ondeDormir)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Profissão:</strong> {getResponse(respostas.profissao)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Como ficou sabendo:</strong> {getResponse(respostas.comoSoube)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Possui automóvel:</strong> {getResponse(respostas.possuiAutomovel)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Pet de interesse:</strong> {getResponse(respostas.petInteresse)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Conhecimento sobre leishmaniose:</strong> {getResponse(respostas.conhecimentoLeishmaniose)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Atitude em caso de leishmaniose:</strong> {getResponse(respostas.atitudeLeishmaniose)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Possui animais em casa:</strong> {getResponse(respostas.temAnimais)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Quantos animais:</strong> {getResponse(respostas.quantosAnimais)}</p>
                <p style={{ marginBottom: '4px' }}><strong>São castrados:</strong> {getResponse(respostas.saoCastrados)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Tempo castrado:</strong> {getResponse(respostas.tempoCastrados)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Possuem cartão de vacina:</strong> {getResponse(respostas.cartoesVacina)}</p>
                <p style={{ marginBottom: '4px' }}><strong>Comentários:</strong> {getResponse(respostas.comentarioAdicional)}</p>
            </div>
        );
    };


    return (
        <div style={{ display: 'flex' }}>
            <Menu />
            <div className="historico-container" style={{ height: '100vh', flex: 1, padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Header headerName={'Histórico de Adoções'} />
                </div>
                <Divider />
                <Card bordered={false} style={{ marginTop: "8px" }}>
                    {initLoading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : loading ? (
                        <p>Carregando adoções...</p>
                    ) : adocoes.length === 0 ? (
                        <p>Você ainda não possui adoções.</p>
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={adocoes}
                            renderItem={(adocao) => (
                                <List.Item
                                    actions={isAdmin ? [
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }} >
                                            <EditOutlined onClick={() => showModal(adocao)} style={iconStyle} />
                                        </div>,
                                        <div style={{ display: 'flex', alignItems: 'center' }} >
                                            <Button
                                                icon={<InfoCircleOutlined />}
                                                onClick={() => showRespostasModal(adocao)}
                                                style={{ ...iconStyle, border: 'none', background: 'transparent', padding: 0 }}
                                            />
                                        </div>
                                    ] : []}
                                >
                                    <Skeleton loading={loading} active>
                                        <List.Item.Meta
                                            title={`Adoção #${adocao.id} - Adotante: ${adocao.usuarioNome} - Pet: ${adocao.petNome} - Status: ${adocao.status} `}
                                            description={`Data da Adoção: ${formatDate(adocao.data)} | Próximo Acompanhamento: ${adocao.proximoAcompanhamento ? formatDate(adocao.proximoAcompanhamento) : 'N/A'}`}
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                    )}
                </Card>

                <Modal
                    title="Editar Adoção"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        initialValues={{
                            status: selectedAdocao?.status,
                            proximoAcompanhamento: selectedAdocao?.proximoAcompanhamento ? selectedAdocao.proximoAcompanhamento.split('T')[0] : '',
                        }}
                        onFinish={handleOk}
                    >
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
                            onChange={(e) => handleStatusChange(e.target.value)} // Atualiza o status
                        >
                            <Select placeholder="Selecione o status">
                                <Option value="PENDENTE">PENDENTE</Option>
                                <Option value="APROVADA">APROVADA</Option>
                                <Option value="RECUSADA">RECUSADA</Option>
                                <Option value="EM_ANDAMENTO">EM ANDAMENTO</Option>
                            </Select>
                        </Form.Item>

                        {/* Exibe o campo "Próximo Acompanhamento" somente se o status for "APROVADA" */}

                        <Form.Item
                            label="Próximo Acompanhamento"
                            name="proximoAcompanhamento"
                        >
                            <Input type="date" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={buttonStyle}>Salvar</Button>
                        </Form.Item>
                    </Form>
                </Modal>


                {/* Modal para exibir as respostas */}
                <Modal
                    title="Respostas do Formulário"
                    visible={isRespostasModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={600}
                >
                    {renderRespostasFormulario(selectedAdocao?.respostasFormulario)}
                </Modal>
            </div>
        </div>
    );
};

export default HistoricoAdocao;