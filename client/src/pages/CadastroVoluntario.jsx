import { useState } from 'react';
import Menu from '../components/Menu';
import { Form, Input, Select, Button, Checkbox, Card } from "antd";
import AuthService from '../services/AuthService.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/CadastroVoluntario.css';
import Header from '../components/Header';
import { Divider } from "@mui/material";

const CadastroVoluntario = () => {
    const user = AuthService.getCurrentUser();
    const id = user.id;
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [outrosContribuicao, setOutrosContribuicao] = useState('');
    const [formData, setFormData] = useState({
        profissao: '',
        tempoDisponivel: '',
        contribuicoes: []
    });

    const handleSubmit = async (values) => {
        if (!id) {
            console.error("User ID is undefined");
            return;
        }

        const contribuicoesFinal = [...formData.contribuicoes];
        if (outrosContribuicao) {
            contribuicoesFinal.push(outrosContribuicao);
        }

        const voluntarioData = {
            profissao: values.profissao,
            tempoDisponivel: values.tempoDisponivel,
            contribuicoes: contribuicoesFinal.join(','),
        };

        try {
            const response = await fetch(`http://localhost:3001/api/usuario/${id}/voluntario`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voluntarioData),
            });

            if (response.ok) {
                navigate('/perfil');
            } else {
                throw new Error('Falha ao cadastrar o voluntário');
            }
        } catch (error) {
            alert(`Erro ao cadastrar o voluntário: ${error.message}`);
        }
    };


    const handleOutrosChange = (e) => {
        setOutrosContribuicao(e.target.value);
    };

    const handleCheckboxChange = (checkedValues) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            contribuicoes: checkedValues,
        }));
    };

    const goBackToProfile = () => {
        navigate('/perfil');
    };

    return (
        <>

        <div style={{ display: "flex" }}>
        <Menu />
        <div style={{ height: '100vh', flex: 1, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                size="1x" 
                onClick={goBackToProfile} 
                style={{ cursor: "pointer", marginRight: "8px" }} 
            />
            <Header headerName={'Cadastro de Voluntário'} />
            </div>
            <Divider />

                    <Card className='cardd'>
                        <Form
                            form={form}
                            name="register"
                            layout="vertical"
                            onFinish={handleSubmit}
                            className='form'

                        >
                            <Form.Item
                                label="Profissão"
                                name="profissao"
                                rules={[{ required: true, message: 'Por favor, insira sua profissão!' }]}
                            >
                                <Input
                                                                placeholder="Profissão"
                                                                />
                            </Form.Item>

                            <Form.Item
                                label="Disponibilidade durante a semana"
                                name="tempoDisponivel"
                                className="disponibilidade-semana"
                                rules={[{ required: true, message: 'Por favor, descreva sua disponibilidade!' }]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Exemplo: Segunda a Sexta, de 08:00 às 12:00 e de 14:00 às 18:00."
                                    maxLength={500}
                                    id="tempoDisponivel"
                                    value={formData.tempoDisponivel}
                                    onChange={(e) => handleChange('tempoDisponivel', e.target.value)} // Atualiza o estado
                                />
                            </Form.Item>

                            <Form.Item label="Contribuições">
                                <Checkbox.Group onChange={handleCheckboxChange}>
                                    <Checkbox value="passeios">Passeios com o pet</Checkbox>
                                    <Checkbox value="lar">Lar temporário</Checkbox>
                                    <Checkbox value="transporte">Transporte de animais</Checkbox>
                                    <Checkbox value="feiras">Auxílio em feiras</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>

                            <Form.Item label="Outros tipos de contribuição">
                                <Input
                                    placeholder="Se houver, descreva aqui"
                                    onChange={handleOutrosChange} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='botaoEnviar'>
                                    Enviar
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div></>

    );
};

export default CadastroVoluntario;
