import { useState } from 'react';
import { Form, Input, Select, Button, Row, Col, Radio, DatePicker, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import fotoCadastroPet from '../assets/fotocadastroPet.png';
import '../styles/CadastroPet.css';
import moment from 'moment';

const { TextArea } = Input;

const CadastroPet = () => {
    const [form] = Form.useForm();
    const [hasCondition, setHasCondition] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [setIdadeTipo] = useState('anos');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        idade: '',
        sexo: '',
        porte: '',
        deficiencia: '',
        descricaoDeficiencia: '',
        comportamento: '',
        peso: '',
        raca: '',
        cor: '',
        img: '',
        especie: '',
        protetor: '',
        dataResgate: null,
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSelectChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleRadioChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            deficiencia: value,
            descricaoDeficiencia: value === 'sim' ? prevData.descricaoDeficiencia : '',
        }));
        setHasCondition(value === 'sim');
    };
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const onFinish = async (values) => {
        console.log('Formulário de Pet enviado:', values);
        navigate('/pets');

        const formattedData = {
            ...values,
            peso: parseFloat(values.peso),
            idade: parseInt(values.idade),
            dataResgate: values.dataResgate ? values.dataResgate : null,
        };

        console.log('Dados formatados:', formattedData);

        if (isNaN(formattedData.peso) || isNaN(formattedData.idade)) {
            message.error('Por favor, insira valores válidos para peso e idade.');
            return;
        }

        const formDataToSend = new FormData();


        Object.keys(formattedData).forEach(key => {
            if (formattedData[key] !== null && formattedData[key] !== undefined) {
                formDataToSend.append(key, formattedData[key]);
            }
        });


        if (fileList.length > 0) {
            formDataToSend.append('img', fileList[0].originFileObj);
        } else {
            message.error('Nenhuma imagem foi selecionada.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/pet', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Erro do servidor:', errorDetails);
                throw new Error('Erro ao enviar o formulário');
            }

            const result = await response.json();
            console.log('Pet cadastrado com sucesso:', result);
            message.success('Pet cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar o pet:', error);
            message.error('Erro ao cadastrar o pet. Tente novamente mais tarde.');
        }
    };

    return (
        <div className='cadastroPet-container'>
            <div className='cadastroPet-image'>
                <img src={fotoCadastroPet} alt='Foto de um cachorro' className='cachorro-image' />
            </div>
            <div className='pet-form'>
                <h1 style={{ marginTop: "0.5vw" }}>Cadastro de Pet</h1>
                <Form
                    form={form}
                    name="petRegister"
                    layout="vertical"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Nome do pet"
                                name="nome"
                                rules={[{ required: true, message: 'Por favor, insira o nome do pet!' }]}
                            >
                                <Input placeholder="Digite o nome do pet" value={formData.nome} onChange={handleChange} id="nome" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="Idade do Pet"
                                name="idade"
                                rules={[{ required: true, message: 'Por favor, insira a idade do pet!' }]}
                            >
                                <Input.Group compact>
                                    <Input
                                        style={{ width: '60%' }}
                                        placeholder="Digite a idade"
                                        type="number"
                                        onChange={(e) => {
                                            form.setFieldsValue({ idade: e.target.value });
                                        }}
                                    />
                                    <Select
                                        defaultValue="anos"
                                        style={{ width: '35%', height: '3.3em', backgroundColor: '#F0F4F9' }}
                                        onChange={(value) => setIdadeTipo(value)}
                                    >
                                        <Select.Option value="meses">Meses</Select.Option>
                                        <Select.Option value="anos">Anos</Select.Option>
                                    </Select>
                                </Input.Group>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Sexo"
                                name="sexo"
                                rules={[{ required: true, message: 'Por favor, selecione o sexo do pet!' }]}
                            >
                                <Select placeholder="Selecione o sexo" className="custom-select" style={{ height: "45px", width: "16vw", color: "#A0A0A0", borderRadius: "7px" }} value={formData.sexo} onChange={(value) => handleSelectChange('sexo', value)}>
                                    <Select.Option value="macho">Macho</Select.Option>
                                    <Select.Option value="femea">Fêmea</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Porte"
                                name="porte"
                                rules={[{ required: true, message: 'Por favor, selecione o porte do pet!' }]}
                            >
                                <Select placeholder="Selecione o porte" style={{ height: "45px", width: "16vw", backgroundColor: "#F0F4F9", borderRadius: "7px" }} value={formData.porte} onChange={(value) => handleSelectChange('porte', value)}>
                                    <Select.Option value="alto">Grande</Select.Option>
                                    <Select.Option value="medio">Médio</Select.Option>
                                    <Select.Option value="baixo">Pequeno</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="Peso (kg)"
                                name="peso"
                                rules={[{ required: true, message: 'Por favor, insira o peso do pet!' }]}
                            >
                                <Input placeholder="Digite o peso" type="number" step="0.01" value={formData.peso} onChange={handleChange} id="peso" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Raça"
                                name="raca"
                                rules={[{ required: true, message: 'Por favor, insira a raça do pet!' }]}
                            >
                                <Input placeholder="Digite a raça" value={formData.raca} onChange={handleChange} id="raca" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Pelagem"
                                name="cor"
                                rules={[{ required: true, message: 'Por favor, insira a cor do pet!' }]}
                            >
                                <Input placeholder="Digite a pelagem" value={formData.cor} onChange={handleChange} id="cor" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Imagem do Pet"
                                name="img"
                                rules={[{ required: true, message: 'Por favor, insira a URL da imagem!' }]}
                            >
                                <Upload

                                    listType="picture"
                                    fileList={fileList}
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                >
                                    <Button style={{
                                        backgroundColor: "#F0F4F9",
                                        color: " #A0A0A0",
                                        width: "53vw",
                                        marginLeft: "0.1vw",
                                        fontSize: "14px",
                                        marginTop: "0.1vw",
                                        marginBottom: "0.1vw"

                                    }} icon={<UploadOutlined />}>Selecione uma imagem</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="Espécie"
                                name="especie"
                                rules={[
                                    { required: true, message: 'Por favor, selecione a espécie do pet!' },
                                ]}
                            >
                                <Select
                                    style={{ height: "45px", width: "16vw", backgroundColor: "#F0F4F9", borderRadius: "7px" }}
                                    placeholder="Selecione a espécie"
                                    value={formData.especie}
                                    onChange={(value) =>
                                        handleChange({ target: { id: 'especie', value } })
                                    }
                                    id="especie"
                                >
                                    <Select.Option value="canino">Canino</Select.Option>
                                    <Select.Option value="felino">Felino</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Protetor"
                                name="protetor"
                                rules={[{ required: true, message: 'Por favor, insira o nome do protetor!' }]}
                            >
                                <Input placeholder="Digite o nome do protetor" value={formData.protetor} onChange={handleChange} id="protetor" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item

                                label="Data de Resgate"
                                name="dataResgate"

                            >
                                <DatePicker
                                    style={{ height: "45px", width: "16vw", backgroundColor: "#F0F4F9", borderRadius: "7px" }}
                                    format="YYYY-MM-DD"
                                    value={formData.dataResgate ? moment(formData.dataResgate) : null}
                                    onChange={(date) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            dataResgate: date ? date.format('YYYY-MM-DD') : null,
                                        }));
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Possui alguma deficiência ou doença?"
                                name="deficiencia"
                                rules={[{ required: true, message: 'Por favor, insira o estado de saúde do pet!' }]}
                            >
                                <Radio.Group onChange={handleRadioChange} value={formData.deficiencia}>
                                    <Radio value="sim">Sim</Radio>
                                    <Radio value="nao">Não</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    {hasCondition && (
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="Se sim, qual?"
                                    name="descricaoDeficiencia"
                                    rules={[{ required: true, message: 'Por favor, insira o detalhe da condição!' }]}
                                >
                                    <Input placeholder="Descreva a condição" value={formData.descricaoDeficiencia} onChange={handleChange} id="descricaoDeficiencia" />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Descreva o comportamento do seu pet"
                                name="comportamento"
                                rules={[{ required: true, message: 'Por favor, insira o comportamento do seu pet!' }]}
                            >
                                <TextArea rows={4} placeholder="Insira mais detalhes ou observações sobre o pet"
                                    value={formData.comportamento}
                                    onChange={handleChange} id="comportamento" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="button-wrapper">
                        <Button className="button-container" type="primary" htmlType="submit">
                            Cadastrar
                        </Button>
                    </div>

                </Form>
            </div>
        </div>
    );
};

export default CadastroPet;