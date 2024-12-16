import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Checkbox, Button, Row, Col, Modal, notification } from 'antd';
import '../styles/Cadastro.css';
import fotoCadastro from '../assets/fotocadastro.png';
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import AuthService from '../services/AuthService';

const Cadastro = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [isVoluntario, setIsVoluntario] = useState(false);
    const [formData, setFormData] = useState({
        CPF: '',
        nome: '',
        email: '',
        tel: '',
        senha: '',
        dataNascimento: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        contribuicoes: [],
        tempoDisponivel: ''
    });
    const [outrosContribuicao, setOutrosContribuicao] = useState('');
    const [isCepValid, setIsCepValid] = useState(false);

    const openNotification = () => {
        notification.success({
            message: 'Sucesso!',
            description: 'Usuário cadastrado com sucesso.',
            placement: 'topRight',
        });
    };

    const dataInit = {
        cep: "",
        logradouro: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
    };

    const url = (cep) => {
        return `https://viacep.com.br/ws/${cep}/json/`; // URL da API
    };

    const buscarCep = async (cep) => {
        if (cep.length < 8) {
            setIsCepValid(false);
            return;
        }
        try {
            const response = await fetch(url(cep), { mode: 'cors' });
            const data = await response.json();
            if (data.erro) {
                alert('CEP não encontrado');
                form.setFieldsValue({ logradouro: '', bairro: '', cidade: '', estado: '' });
                setIsCepValid(false);
            } else {
                form.setFieldsValue({
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf,
                });
                setIsCepValid(true);
            }
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
            setIsCepValid(false);
        }
    };

    const handleSubmit = async (values) => {
        if (!isCepValid) {
            alert("Por favor, preencha o CEP corretamente antes de enviar o formulário.");
            return;
        }

        const cepFormatado = values.cep.replace(/\D/g, '');

        const endereco = {
            cep: cepFormatado,
            logradouro: values.logradouro,
            numero: values.numero,
            complemento: values.complemento,
            bairro: values.bairro,
            cidade: values.cidade,
            estado: values.estado,
        };

        const telFormatado = values.tel.replace(/[^0-9()-\s]/g, '').slice(0, 15);
        const CPFFormatado = values.CPF.replace(/[^0-9.-]/g, '').slice(0, 14);

        const contribuicoesFinal = [...formData.contribuicoes];
        if (outrosContribuicao) {
            contribuicoesFinal.push(outrosContribuicao);
        }

        const userData = {
            nome: values.nome,
            email: values.email,
            senha: values.senha,
            dataNascimento: values.dataNascimento,
            CPF: CPFFormatado,
            tel: telFormatado,
            endereco,
            voluntario: isVoluntario,
            profissao: values.profissao || '',
            tempoDisponivel: values.tempoDisponivel || '',
            contribuicoes: contribuicoesFinal,
        };

        try {
            const response = await fetch('http://localhost:3001/api/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                openNotification(); // Mostra a notificação de sucesso

                const loginResponse = await AuthService.login(values.email, values.senha);
                if (loginResponse.token) {
                    const userId = data.id;
                    navigate('/perfil');
                }
            } else {
                const errorData = await response.json();
                console.error('Erro ao criar o usuário:', errorData.message);
                alert(`Erro: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

    const handleChange = (name, value) => {
        console.log(`Campo alterado: ${name}, Valor: ${value}`);
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'cep' && value.length === 8) {
            buscarCep(value);
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

    const preventFormSubmitOnEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="cadastro-containerr">
            <div className='cadastro-image'>
                <img src={fotoCadastro} alt="Foto" className="gato-image" />
            </div>
            <div className="cadastro-formm">
                <h1>CADASTRE-SE</h1>
                <Form
                    form={form}
                    name="register"
                    layout="vertical"
                    onFinish={handleSubmit}
                    scrollToFirstError
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Nome Completo"
                                name="nome"
                                className='campos'
                                rules={[{ required: true, message: 'Por favor, insira seu nome completo!' }]}
                            >
                                <Input
                                    id="nome"
                                    value={formData.nome}
                                    onChange={(e) => handleChange('nome', e.target.value)}
                                    placeholder="Digite seu nome completo"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="E-mail"
                                name="email"
                                className='campos'
                                rules={[
                                    { type: 'email', message: 'O e-mail inserido não é válido!' },
                                    { required: true, message: 'Por favor, insira seu e-mail!' },
                                ]}
                            >
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="Digite seu e-mail"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Telefone"
                                className='campos'
                                name="tel"
                                rules={[{ required: true, message: 'Por favor, insira seu telefone!' }]}
                            >
                                <InputMask
                                    mask="(99) 99999-9999"
                                    value={formData.tel}
                                    onChange={(e) => handleChange('tel', e.target.value)}
                                >
                                    {(inputProps) => <Input {...inputProps} placeholder="Digite seu telefone" />}
                                </InputMask>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="CPF"
                                name="CPF"
                                className='campos'
                                rules={[{ required: true, message: 'Por favor, insira seu CPF!' }]}
                            >
                                <InputMask
                                    mask="999.999.999-99"
                                    value={formData.CPF}
                                    onChange={(e) => handleChange('CPF', e.target.value)}
                                >
                                    {(inputProps) => <Input {...inputProps} placeholder="Digite seu CPF" />}
                                </InputMask>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Data de Nascimento"
                                name="dataNascimento"
                                className='campos'
                                rules={[{ required: true, message: 'Por favor, insira sua data de nascimento!' }]}
                            >
                                <Input
                                    id="dataNascimento"
                                    type="date"
                                    value={formData.dataNascimento}
                                    onChange={(e) => handleChange('dataNascimento', e.target.value)}
                                    placeholder="Selecione sua data de nascimento"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Senha"
                                name="senha"
                                className='campos'
                                rules={[
                                    { required: true, message: 'Por favor, insira sua senha!' },
                                    { min: 8, message: 'A senha deve ter no mínimo 8 caracteres!' },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                                        message: 'A senha deve incluir maiúsculas, minúsculas, números e caracteres especiais!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    id="senha"
                                    value={formData.senha}
                                    onChange={(e) => handleChange('senha', e.target.value)}
                                    placeholder="Digite sua senha"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Confirmar Senha"
                                name="confirmarSenha"
                                className='campos'
                                dependencies={['senha']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Por favor, confirme sua senha!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('senha') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('As senhas não coincidem!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    id="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                                    placeholder="Confirme sua senha"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={18}>
                            <Form.Item
                                label="CEP"
                                name="cep"
                                className='campos'
                                rules={[{ required: true, message: 'Por favor, insira seu CEP!' }]}
                            >
                                <InputMask
                                    mask="99999-999"
                                    value={formData.cep}
                                    onChange={(e) => handleChange('cep', e.target.value.replace(/\D/g, ''))} // Remove caracteres não numéricos
                                    onKeyDown={preventFormSubmitOnEnter}
                                >
                                    {(inputProps) => <Input {...inputProps} placeholder="Digite seu CEP" />}
                                </InputMask>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Número"
                                className='campos'
                                name="numero"
                                rules={[{ required: true, message: 'Por favor, insira o número da sua residência!' }]}
                            >
                                <Input
                                    id="numero"
                                    value={formData.numero}
                                    onChange={(e) => handleChange('numero', e.target.value)}
                                    placeholder="Número da residência"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Rua"
                                className='campos'
                                name="logradouro"
                                rules={[{ required: true, message: 'Por favor, insira o nome da sua rua!' }]}
                            >
                                <Input
                                    id="logradouro"
                                    value={formData.logradouro}
                                    placeholder="Digite sua rua"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                label="Bairro"
                                name="bairro"
                                className='campos'
                                rules={[{ required: true, message: 'Por favor, insira seu bairro!' }]}
                            >
                                <Input
                                    id="bairro"
                                    value={formData.bairro}
                                    placeholder="Digite seu bairro"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Cidade"
                                className='campos'
                                name="cidade"
                                rules={[{ required: true, message: 'Por favor, insira sua cidade!' }]}
                            >
                                <Input
                                    id="cidade"
                                    value={formData.cidade}
                                    placeholder="Digite sua cidade"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Estado"
                                name="estado"
                                className='campos'
                                rules={[{ required: true, message: 'Por favor, insira seu estado!' }]}
                            >
                                <Input
                                    id="estado"
                                    value={formData.estado}
                                    placeholder="Digite seu estado"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Complemento"
                                name="complemento"
                                className='campos'
                            >
                                <Input
                                    id="complemento"
                                    value={formData.complemento}
                                    onChange={(e) => handleChange('complemento', e.target.value)}
                                    placeholder="Digite um complemento (opcional)"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Voluntário checkbox */}
                    <Form.Item className='querVolunt' name="voluntario" valuePropName="checked">
                        <Checkbox className='querVolunt' onChange={(e) => setIsVoluntario(e.target.checked)}>
                            Deseja se voluntariar? <FontAwesomeIcon icon={faCircleInfo} onClick={showModal} />
                        </Checkbox>
                    </Form.Item>

                    {isVoluntario && (
                        <>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Profissão"
                                        name="profissao"
                                    >
                                        <Input
                                            value={formData.profissao}
                                            onChange={(e) => handleChange('profissao', e.target.value)}
                                            placeholder="Digite sua profissão"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
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
                                            value={formData.tempoDisponivel} // Define o valor inicial
                                            onChange={(e) => handleChange('tempoDisponivel', e.target.value)} // Atualiza o estado
                                        />
                                    </Form.Item>
                                </Col>


                            </Row>

                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label="Com o que você pode contribuir?" name="contribuicoes">
                                        <Checkbox.Group onChange={handleCheckboxChange}>
                                            <Row>
                                                <Col span={8}>
                                                    <Checkbox value="passeios">Passeios com o pet</Checkbox>
                                                </Col>
                                                <Col span={8}>
                                                    <Checkbox value="lar">Lar temporário</Checkbox>
                                                </Col>
                                                <Col span={8}>
                                                    <Checkbox value="transporte">Transporte de animais</Checkbox>
                                                </Col>
                                                <Col span={8}>
                                                    <Checkbox value="feiras">Auxílio em feiras</Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Outros tipos de contribuição"
                                        name="outrosContribuicao"
                                    >
                                        <Input
                                            placeholder="Se houver, descreva aqui"
                                            onChange={handleOutrosChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='botaoCad'>
                            Cadastrar
                        </Button>
                        <div className='possuiConta'>
                            Já possui uma conta? <Link to="/login">Login</Link>
                        </div>
                    </Form.Item>
                </Form>

            </div>

            <Modal
                open={isModalVisible}
                onCancel={handleClose}
                footer={null}
            >
                <div className="text-content-volunteer">
                    <h2>O que os voluntários fazem?</h2>
                    <p>
                        As atividades dos voluntários são diversas e podem variar conforme as necessidades da ONG. Aqui estão alguns exemplos de como você pode ajudar:
                    </p>
                    <ul className="volunteer-list">
                        <li>
                            <strong>Passeios com os pets: </strong>
                            Durante as feiras, os voluntários ajudam a passear com os animais, garantindo que eles estejam tranquilos, façam suas necessidades e fiquem mais confortáveis durante os eventos.
                        </li>
                        <li>
                            <strong>Transporte de animais: </strong>
                            Dependendo da região, voluntários ajudam no transporte dos animais até as feiras ou outros locais necessários, garantindo segurança e bem-estar durante o trajeto.
                        </li>
                        <li>
                            <strong>Ajuda nas feiras de adoção: </strong>
                            Os voluntários auxiliam na montagem e organização do evento, passando informações sobre a ADAC e os animais para os visitantes interessados.
                        </li>
                        <li>
                            <strong>Criação de mídias e redes sociais: </strong>
                            Voluntários com habilidades em comunicação podem apoiar na produção de conteúdo para as redes sociais e campanhas de divulgação da ONG.
                        </li>
                        <li>
                            <strong>Setor administrativo e jurídico: </strong>
                            Pessoas com conhecimentos nessas áreas podem contribuir com a gestão da ONG, ajudando em tarefas estratégicas e burocráticas.
                        </li>
                        <li>
                            <strong>Atendimento a famílias em situação de vulnerabilidade: </strong>
                            Voluntários comunicativos e observadores são fundamentais para lidar com essas famílias, oferecendo suporte com empatia e cuidado.
                        </li>
                    </ul>
                    <p>
                        Estas são apenas algumas das maneiras de contribuir. Há muitas outras atividades onde voluntários podem fazer a diferença, dependendo de suas habilidades e do tempo disponível!
                    </p>
                </div>

            </Modal>

        </div>
    );
};

export default Cadastro;
