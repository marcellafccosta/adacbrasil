/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, message } from 'antd';
import fotoLogin from '../assets/login-image.png';
import logo from '../assets/adaclogoredonda.png';
import AuthService from '../services/AuthService';
import '../styles/RecuperarSenha.css';

const RecoverPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            await AuthService.recoverPassword(values.email);
            message.success('Um e-mail de recuperação foi enviado!');
            navigate('/login');
        } catch (error) {
            message.error('Erro ao enviar o e-mail de recuperação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="RecoverPassword-container">
            <div className="RecoverPassword-image">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <img src={fotoLogin} alt="Recuperar Senha" />
            </div>
            <div className="RecoverPassword-form">
                <h1>Recuperar Senha</h1>
                <Form
                    form={form}
                    name="recover_password"
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
                                rules={[
                                    { type: 'email', message: 'O e-mail inserido não é válido!' },
                                    { required: true, message: 'Por favor, insira seu e-mail!' },
                                ]}
                            >
                                <Input
                                    id="email"
                                    placeholder="Digite seu e-mail"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='botaoRecuperar' loading={loading}>
                            Enviar e-mail de recuperação
                        </Button>
                        <div className='voltarLogin'>
                            Lembrou sua senha? <Link to="/login">Voltar para o Login</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RecoverPassword;