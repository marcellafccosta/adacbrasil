import { useState } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddPatrocinioModal = ({ isVisible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const onFinish = async (values) => {
        const formDataToSend = new FormData();
        Object.keys(values).forEach(key => {
            formDataToSend.append(key, values[key]);
        });

        if (fileList.length > 0) {
            formDataToSend.append('img', fileList[0].originFileObj);
        } else {
            message.error('Nenhuma imagem foi selecionada.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/patrocinio', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const result = await response.json();
                message.success('Patrocínio cadastrado com sucesso!');
                onSuccess();
                onClose();
            } else {
                throw new Error('Erro ao cadastrar o patrocínio');
            }
        } catch (error) {
            console.error('Erro ao cadastrar o patrocínio:', error);
            message.error('Erro ao cadastrar o patrocínio. Tente novamente mais tarde.');
        }
    };

    return (
        <Modal
            title="Cadastrar Novo Patrocínio"
            open={isVisible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Nome do Patrocínio"
                    name="nome"
                    rules={[{ required: true, message: 'Por favor, insira o nome do patrocínio!' }]}
                >
                    <Input placeholder="Digite o nome do patrocínio" />
                </Form.Item>

                <Form.Item
                    label="Descrição"
                    name="descricao"
                    rules={[{ required: true, message: 'Por favor, insira a descrição!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Digite uma breve descrição do patrocínio" />
                </Form.Item>

                <Form.Item
                    label="Imagem do Patrocínio"
                    name="img"
                    rules={[{ required: true, message: 'Por favor, insira a imagem do patrocínio!' }]}
                >
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        beforeUpload={() => false}
                        onChange={handleUploadChange}
                    >
                        <Button icon={<UploadOutlined />}>Selecione uma imagem</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cadastrar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPatrocinioModal;
