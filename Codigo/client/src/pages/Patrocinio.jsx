import { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Upload, message, Popconfirm } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import { Divider } from "@mui/material";
import Menu from '../components/Menu';
import '../styles/Patrocinio.css';

const Patrocinio = () => {
    const [patrocinios, setPatrocinios] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [currentPatrocinio, setCurrentPatrocinio] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        async function fetchPatrocinios() {
            try {
                const response = await fetch("http://localhost:3000/api/patrocinio", {
                    method: 'GET',
                });
                if (response.ok) {
                    const data = await response.json();
                    setPatrocinios(data);
                } else {
                    console.error("Erro ao buscar patrocínios:", response.statusText);
                }
            } catch (error) {
                console.error("Erro ao buscar patrocínios:", error);
            }
        }
        fetchPatrocinios();
    }, []);

    const handleOpenModal = (patrocinio = null) => {
        console.log('Abrindo modal:', patrocinio);
        setIsModalVisible(true);
        setCurrentPatrocinio(patrocinio);

        if (patrocinio) {
            form.setFieldsValue({ nome: patrocinio.nome });
            setFileList([{ uid: '-1', name: 'imagem', url: patrocinio.img }]);
        } else {
            form.resetFields();
            setFileList([]);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setCurrentPatrocinio(null);
        setFileList([]);
        form.resetFields();
    };

    const handleUploadChange = ({ fileList }) => setFileList(fileList);

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('nome', values.nome);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('img', fileList[0].originFileObj);
        }

        try {
            const url = currentPatrocinio
                ? `http://localhost:3000/api/patrocinio/${currentPatrocinio.id}`
                : 'http://localhost:3000/api/patrocinio';

            const method = currentPatrocinio ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData,
            });

            if (response.ok) {
                const updatedPatrocinio = await response.json();

                setPatrocinios((prev) => {
                    if (currentPatrocinio) {

                        return prev.map((p) => p.id === currentPatrocinio.id ? updatedPatrocinio : p);
                    } else {
                        return [...prev, updatedPatrocinio];
                    }
                });

                message.success(currentPatrocinio ? 'Patrocínio atualizado com sucesso!' : 'Patrocínio cadastrado com sucesso!');
                handleCloseModal();
            } else {
                message.error('Erro ao cadastrar o patrocínio.');
            }
        } catch (error) {
            console.error("Erro ao cadastrar o patrocínio:", error);
            message.error('Erro ao cadastrar o patrocínio. Tente novamente mais tarde.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/patrocinio/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPatrocinios((prev) => prev.filter((p) => p.id !== id));
                message.success('Patrocínio deletado com sucesso!');
            } else {
                message.error('Erro ao deletar o patrocínio.');
            }
        } catch (error) {
            console.error("Erro ao deletar o patrocínio:", error);
            message.error('Erro ao deletar o patrocínio. Tente novamente mais tarde.');
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Menu />
            <div style={{ height: '100vh', flex: 1, padding: "1rem" }}>
                <div style={{ display: "flex" }}>
                    <Header headerName={'Patrocínios'} />

                    <Button className="patrocinio-botao" type="primary" onClick={() => handleOpenModal()}>
                        Novo Patrocínio
                    </Button>
                </div>
                <Divider />


                <div className="patrocinio-grid">
                    {patrocinios.length > 0 ? (
                        patrocinios.map((patrocinio) => (
                            <Card
                                key={patrocinio.id}
                                className="patrocinio-card"
                                cover={
                                    <img
                                        src={patrocinio.img}
                                        alt={patrocinio.nome}
                                        className="patrocinio-image"
                                    />
                                }
                                actions={[
                                    <EditOutlined
                                        key="edit"
                                        onClick={() => handleOpenModal(patrocinio)}
                                        style={{ fontSize: '18px' }}
                                    />,
                                    <Popconfirm
                                        title="Tem certeza que deseja deletar este patrocínio?"
                                        onConfirm={() => handleDelete(patrocinio.id)}
                                        okText="Sim"
                                        cancelText="Não"
                                    >
                                        <DeleteOutlined key="delete" style={{ fontSize: '18px' }}></DeleteOutlined>
                                    </Popconfirm>,
                                ]}
                            >
                                <Card.Meta title={patrocinio.nome} />
                            </Card>
                        ))
                    ) : (
                        <p className="no-data-message">Nenhum patrocínio encontrado.</p>
                    )}
                </div>
            </div>

            <Modal
                title={currentPatrocinio ? "Editar Patrocínio" : "Cadastrar Novo Patrocínio"}
                open={isModalVisible} // Confirme que está vinculado a este estado
                onCancel={handleCloseModal}
                footer={null}
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Nome do Patrocínio"
                        name="nome"
                        rules={[{ required: true, message: 'Por favor, insira o nome do patrocínio!' }]}
                    >
                        <Input placeholder="Digite o nome do patrocínio" />
                    </Form.Item>
                    <Form.Item
                        label="Imagem do Patrocínio"
                        name="imagem"
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={handleUploadChange}
                            
                        >
                            <Button type='primary' className='selecione-button' icon={<UploadOutlined />}>Selecione uma imagem</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button className='cadastro-button' type="primary" htmlType="submit">{currentPatrocinio ? "Atualizar" : "Cadastrar"}</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>



    );
}

export default Patrocinio;
