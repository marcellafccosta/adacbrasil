/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, message } from 'antd';
import fotoLogin from '../assets/login-image.png';
import logo from '../assets/adaclogoredonda.png';
import AuthService from '../services/AuthService';
import '../styles/Login.css';

const RecoverPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const response = await AuthService.recoverPassword(values);
            if (response.success) {
                message.success('Instruções de recuperação de senha foram enviadas para seu e-mail.');
                navigate(`/login`);
            } else {
                message.error('Erro ao enviar instruções de recuperação. Tente novamente.');
            }
        } catch (error) {
            message.error('Erro ao enviar instruções de recuperação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Login-container">
            <div className="Login-image">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <img src={fotoLogin} alt="Login" />
            </div>
            <div className="Login-form">
                <h1>Recuperar Senha</h1>
                <Form
                    form={form}
                    name="recover-password"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ prefix: '55' }}
                    scrollToFirstError={false}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="E-mail"
                                name="email"
                                rules={[{ required: true, message: 'Por favor, insira seu e-mail!' }, { type: 'email', message: 'E-mail inválido!' }]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='botaoCad' loading={loading}>
                           Enviar instruções
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RecoverPassword;
