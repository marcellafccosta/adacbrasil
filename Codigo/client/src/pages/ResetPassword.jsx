/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Row, Col, message } from 'antd';
import fotoLogin from '../assets/login-image.png';
import logo from '../assets/adaclogoredonda.png';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import '../styles/Login.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Função para obter os parâmetros de consulta
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            resetToken: params.get('resetToken'),
            email: params.get('email'),
        };
    };

    const { resetToken, email } = getQueryParams(); // Obtém resetToken e email da URL

    const onFinish = async (values) => {
        setLoading(true);

        try {
            console.log(email); // O email deve estar preenchido agora
            const user = await UserService.getByEmail(email);

            const data = {
                userAuthenticateId: user.id,
                token: resetToken,
                password: values.senha,
            };

            const response = await AuthService.resetPassword(data);
            if (response.success) {
                message.success('Senha redefinida com sucesso!');
                navigate(`/login`);
            } else {
                message.error('Erro ao redefinir senha. Tente novamente.');
            }
        } catch (error) {
            message.error('Erro ao redefinir senha. Tente novamente.');
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
                <h1>Definir nova senha</h1>
                <Form
                    form={form}
                    name="reset-password"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ prefix: '55' }}
                    scrollToFirstError={false}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Senha"
                                name="senha"
                                rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Confirmar Senha"
                                name="confirmSenha"
                                dependencies={['senha']}
                                rules={[
                                    { required: true, message: 'Por favor, confirme sua senha!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('senha') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('As senhas não correspondem!'));
                                        },
                                    }),
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='botaoCad' loading={loading}>
                           Redefinir senha
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
