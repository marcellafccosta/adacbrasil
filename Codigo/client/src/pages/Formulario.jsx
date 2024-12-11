import React, { useState, useEffect } from 'react';
import { InstagramFilled, FacebookFilled } from '@ant-design/icons';
import { Button, Form, Input, Select, Checkbox, message, Row, Col } from 'antd';
import InputMask from 'react-input-mask';
import '../styles/Formulario.css';
import { RightOutlined } from '@ant-design/icons';
import { LeftOutlined } from '@ant-design/icons';
import { IoLogoWhatsapp } from "react-icons/io";
import Menu from '../components/Menu';
import Header from '../components/Header';
import { Divider } from "@mui/material";

const { TextArea } = Input;

const Formulario = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    facebook: '',
    instagram: '',
    imovel: '',
    residencia: '',
    moradores: '',
    telefoneMorador: '',
    gostamAnimais: '',
    aprovacaoAdocao: '',
    historicoPets: '',
    oQueAconteceu: '',
    historicoMorte: '',
    oQueAconteceuMorte: '',
    racao: '',
    dispostoRacao: '',
    devolverAnimal: '',
    conhecimentoCastração: '',
    vacinarAnualmente: '',
    comprometeCastrar: '',
    clinicaVeterinaria: '',
    nomeClinica: '',
    conhecimentoVacinas: '',
    quaisVacinas: '',
    atitudePerigo: '',
    desejoAnimal: '',
    condicaoFinanceira: '',
    enviarFotos: '',
    criadoDentroDeCasa: '',
    ondeDormir: '',
    petInteresse: '',
    conhecimentoLeishmaniose: '',
    atitudeLeishmaniose: '',
    prevencaoLeishmaniose: '',
    temAnimais: '',
    quantosAnimais: '',
    saoCastrados: '',
    tempoCastrados: '',
    profissao: '',
    comoSoube: '',
    possuiAutomovel: '',
    concordoCiente: false,
  });

  const [usuario, setUsuario] = useState({});
  const [petData, setPetData] = useState(null);

  useEffect(() => {
    // Pegar os parâmetros da URL
    const url = window.location.href;
    const parsedUrl = new URL(url);
    const usuarioId = Number(parsedUrl.searchParams.get('userId'));
    const petId = Number(parsedUrl.searchParams.get('petId'));

    const fetchData = async () => {
      try {
        // Buscar dados do pet
        if (petId) {
          const petResponse = await fetch(`http://localhost:3000/api/pet/${petId}`);
          if (petResponse.ok) {
            const pet = await petResponse.json();
            setFormData((prev) => ({
              ...prev,
              petInteresse: pet.especie,
            }));
            setPetData(pet);
          } else {
            console.error('Erro ao buscar os dados do pet.');
          }
        }

        // Buscar dados do usuário
        if (usuarioId) {
          const userResponse = await fetch(`http://localhost:3000/api/usuario/${usuarioId}`);
          if (userResponse.ok) {
            const user = await userResponse.json();
            setUsuario(user);
          } else {
            console.error('Erro ao buscar os dados do usuário.');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchData();
  }, []);

  // Função para calcular idade
  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const enviarParaWhatsapp = () => {
    const idade = calcularIdade(usuario.dataNascimento); // Calculating age
    const enderecoCompleto = `${usuario.endereco.logradouro}, ${usuario.endereco.numero}, ${usuario.endereco.bairro}, ${usuario.endereco.cidade} - ${usuario.endereco.estado}`; // Formatting address

    const url =
      "https://wa.me/5531999927121?text=" +
      "*FORMULÁRIO DE ADOÇÃO*" + "%0a" +
      "%0a" +
      "*DADOS PESSOAIS*" + "%0a" +
      "%0a" +
      "*Nome*: " + usuario.nome + "%0a" +
      "*Idade*: " + idade + " anos" + "%0a" +
      "*CPF*: " + usuario.CPF + "%0a" +
      "*Endereço*: " + enderecoCompleto + "%0a" +
      "*Telefone*: " + usuario.tel + "%0a" +
      "*Email*: " + usuario.email + "%0a" +
      "*Facebook*: " + formData.facebook + "%0a" +
      "*Instagram*: " + formData.instagram + "%0a" +
      "%0a" +
      "*ESTRUTURA DA RESIDÊNCIA*" + "%0a" +
      "%0a" +
      "*Imóvel*: " + formData.imovel + "%0a" +
      "*Tipo de Residência*: " + formData.residencia + "%0a" +
      "*Quantas pessoas residem*: " + formData.moradores + "%0a" +
      "*Telefone de outro morador*: " + formData.telefoneMorador + "%0a" +
      "*Gostam de Animais*: " + formData.gostamAnimais + "%0a" +
      "*Aprovação da Adoção*: " + formData.aprovacaoAdocao + "%0a" +
      "%0a" +
      "*HISTÓRICO DE PETS*" + "%0a" +
      "%0a" +
      "*Histórico de Pets*: " + formData.historicoPets + "%0a" +
      "*O que aconteceu com ele*: " + formData.oQueAconteceu + "%0a" +
      "*Histórico de morte de animalzinho*: " + formData.historicoMorte + "%0a" +
      "*O que aconteceu com o animal*: " + formData.oQueAconteceuMorte + "%0a" +
      "*Ração dada*: " + formData.racao + "%0a" +
      "%0a" +
      "*CUIDADOS COM O ANIMAL*" + "%0a" +
      "%0a" +
      "*Disposto a dar ração de qualidade*: " + formData.dispostoRacao + "%0a" +
      "*Em qual situação devolveria o animalzinho*: " + formData.devolverAnimal + "%0a" +
      "*Conhecimento sobre castração*: " + formData.conhecimentoCastração + "%0a" +
      "*Está disposto(a) a vacinar anualmente*: " + formData.vacinarAnualmente + "%0a" +
      "*Compromete-se a castrar*: " + formData.comprometeCastrar + "%0a" +
      "%0a" +
      "*SAÚDE E BEM-ESTAR DO ANIMAL*" + "%0a" +
      "%0a" +
      "*Tem clínica veterinária próxima*: " + formData.clinicaVeterinaria + "%0a" +
      "*Nome da clínica*: " + formData.nomeClinica + "%0a" +
      "*Conhecimento sobre vacinas*: " + formData.conhecimentoVacinas + "%0a" +
      "*Quais vacinas*: " + formData.quaisVacinas + "%0a" +
      "%0a" +
      "*SITUAÇÕES ESPECIAIS E COMPROMISSO*" + "%0a" +
      "%0a" +
      "*Atitude em caso de perigo*: " + formData.atitudePerigo + "%0a" +
      "*Desejo de ter um animal*: " + formData.desejoAnimal + "%0a" +
      "*Condição financeira para ração premium*: " + formData.condicaoFinanceira + "%0a" +
      "*Enviaria fotos/vídeos do animal*: " + formData.enviarFotos + "%0a" +
      "*Animal será criado dentro de casa*: " + formData.criadoDentroDeCasa + "%0a" +
      "*Onde o animal vai dormir*: " + formData.ondeDormir + "%0a" +
      "%0a" +
      "*INFORMAÇÕES ADICIONAIS*" + "%0a" +
      "%0a" +
      "*Profissão*: " + formData.profissao + "%0a" +
      "*Como ficou sabendo*: " + formData.comoSoube + "%0a" +
      "*Possui automóvel*: " + formData.possuiAutomovel + "%0a" +
      "%0a" +
      "*INFORMAÇÕES SOBRE LEISHMANIOSE*" + "%0a" +
      "%0a" +
      "*Pet de interesse*: " + formData.petInteresse + "%0a" +
      "*Conhecimento sobre leishmaniose*: " + formData.conhecimentoLeishmaniose + "%0a" +
      "*Atitude em caso de leishmaniose*: " + formData.atitudeLeishmaniose + "%0a" +
      "*Sabe como prevenir leishmaniose*: " + formData.prevencaoLeishmaniose + "%0a" +
      "%0a" +
      "*OUTROS ANIMAIS NA RESIDÊNCIA*" + "%0a" +
      "%0a" +
      "*Tem animais em casa*: " + formData.temAnimais + "%0a" +
      "*Quantos animais*: " + formData.quantosAnimais + "%0a" +
      "*São castrados*: " + formData.saoCastrados + "%0a" +
      "*Tempo de castrados*: " + formData.tempoCastrados + "%0a" +
      "%0a" +
      "*FONTE DE INFORMAÇÃO*" + "%0a" +
      "*OUTROS COMENTÁRIOS*: " + formData.comentarioAdicional + "%0a" +
      "%0a" +
      "%0a" +
      "%0a" +
      "*ATENÇÃO!*%0a" +
      "%0a" +
      "*Serão solicitadas algumas fotos, dentre elas:* %0a" +
      "*- Comprovante de endereço* %0a" +
      "*- Imagens do lugar onde o animalzinho vai ficar* %0a" +
      "*- Fotos dos cartões de vacinas dos seus pets (Caso você tenha)* %0a" +
      "%0a" +
      "*ESSAS IMAGENS SÃO OBRIGATÓRIAS E FAZEM PARTE DO PROCESSO.*";

    window.open(url, '_blank').focus();
  };



  const getPageTitle = () => {
    switch (step) {
      case 1: return "Informações de Contato";
      case 2: return "Estrutura da Residência";
      case 3: return "Histórico de Pets";
      case 4: return "Cuidados com o Animal";
      case 5: return "Saúde e Bem-Estar do Animal";
      case 6: return "Situações Especiais e Compromisso";
      case 7: return "Informações Adicionais e Documentação";
      case 8: return "Informações Sobre Leishmaniose";
      case 9: return "Outros Animais na Residência";
      case 10: return "Fonte de Informação";
      case 11: return "Responsabilidades e Compromissos";
      default: return "";
    }
  };

  const enviarFormulario = async () => {
    const url = window.location.href;
    const parsedUrl = new URL(url);
    const usuarioId = Number(parsedUrl.searchParams.get('userId')); // Obtendo o User ID como número
    const petId = Number(parsedUrl.searchParams.get('petId')); // Obtendo o Pet ID como número

    // Criação do objeto de dados com a data fixa e IDs como números
    const data = {
      data: "2024-10-17T12:00:00Z", // Data fixa no formato ISO 8601
      status: "PENDENTE",
      usuarioId: usuarioId, // Mantém o ID do usuário que você deseja
      petId: petId, // Mantém o ID do pet que você deseja
      respostasFormulario: formData // Inclui as respostas do formulário
    };

    try {
      console.log('Dados enviados:', data); // Log para verificar os dados
      const response = await fetch('http://localhost:3000/api/adocao/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Pega a resposta de erro
        throw new Error(`Erro ao enviar formulário: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('Formulário enviado com sucesso:', result);

    } catch (error) {
      console.error('Erro:', error.message);
    }
  };

  const handleEnviarFormulario = async () => {
    // Defina campos não preenchidos como null
    const sanitizedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value || null])
    );

    // Atualize o estado com os dados sanitizados
    setFormData(sanitizedFormData);



    try {
      await enviarFormulario();
      enviarParaWhatsapp();

      window.location.href = '/HistoricoAdocao';
    } catch (error) {
      console.error('Erro ao enviar formulário:', error.message);
    }

  };

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const nextPage = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 11));
  };

  const prevPage = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const onFinish = (values) => {
    nextPage();
  };

  const handleCheckboxChange = (platform, checked) => {
    if (platform === 'facebook') {
      setFormData((prev) => {
        const newFacebookValue = checked ? `Não possuo ${platform}` : prev.facebook; // Define o valor
        return {
          ...prev,
          facebookDisabled: checked,
          facebook: newFacebookValue, // Atualiza o campo de Facebook
        };
      });
    } else if (platform === 'instagram') {
      setFormData((prev) => {
        const newInstagramValue = checked ? `Não possuo ${platform}` : prev.instagram; // Define o valor
        return {
          ...prev,
          instagramDisabled: checked,
          instagram: newInstagramValue, // Atualiza o campo de Instagram
        };
      });
    }
  };



  const renderPageContent = () => {
    const pageClass = `page-${step}`;
    const filledStyle = { background: '#F0F2F5', borderRadius: '4px' };
    switch (step) {
      case 1:
        return (
          <div style={{ padding: '0px 20px', marginTop: "8px" }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                className='campos'
                label="Facebook"
                name="facebook"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value || formData.facebookDisabled) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Por favor, preencha o Facebook ou selecione "Não possuo Facebook"!'));
                    },
                  },
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FacebookFilled style={{ color: '#041E41', fontSize: '24px', marginRight: '8px' }} />
                  <Input
                    placeholder="Facebook"
                    value={formData.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    disabled={formData.facebookDisabled}
                    style={filledStyle}
                  />
                </div>
                <Checkbox
                  onChange={(e) => handleCheckboxChange('facebook', e.target.checked)}
                  style={{ marginTop: '8px' }}
                >
                  Não possuo Facebook
                </Checkbox>
              </Form.Item>

              <Form.Item
                label="Instagram"
                name="instagram"
                className='campos'
                rules={[
                  {
                    validator: (_, value) => {
                      if (value || formData.instagramDisabled) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Por favor, preencha o Instagram ou selecione "Não possuo Instagram"!'));
                    },
                  },
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <InstagramFilled style={{ color: '#041E41', fontSize: '24px', marginRight: '8px' }} />
                  <Input
                    placeholder="Instagram"
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    disabled={formData.instagramDisabled}
                    style={filledStyle}
                  />
                </div>
                <Checkbox
                  onChange={(e) => handleCheckboxChange('instagram', e.target.checked)}
                  style={{ marginTop: '8px' }}
                >
                  Não possuo Instagram
                </Checkbox>
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button htmlType="submit" style={{ border: 0, color: '#041E41' }}>
                  <RightOutlined style={{ marginRight: '5px', color: '#041E41' }} />
                  Próxima página
                </Button>
              </div>
            </Form>
          </div>
        );

      case 2:
        return (
          <div className={pageClass} style={{ padding: '20px' }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Você mora em imóvel alugado ou próprio:"
                name="imovel"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione o tipo de imóvel!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.imovel}
                  onChange={(value) => handleChange('imovel', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Alugado">Alugado</Select.Option>
                  <Select.Option value="Próprio">Próprio</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Casa ou apartamento:"
                name="residencia"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione o tipo de residência!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.residencia}
                  onChange={(value) => handleChange('residencia', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Casa">Casa</Select.Option>
                  <Select.Option value="Apartamento">Apartamento</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Quantas pessoas residem na sua casa:"
                name="moradores"
                className='campos'
                rules={[{ required: true, message: 'Por favor, insira o número de moradores!' }]}
              >
                <Input
                  type="number"
                  value={formData.moradores}
                  onChange={(e) => handleChange('moradores', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>
              <Form.Item
                label="Telefone de outro morador:"
                name="telefoneMorador"
                className='campos'
                rules={[{ required: true, message: 'Por favor, insira o telefone de outro morador!' }]}
              >
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.telefoneMorador}
                  onChange={(e) => handleChange('telefoneMorador', e.target.value)}
                >
                  {(inputProps) => (
                    <Input {...inputProps} style={filledStyle} />
                  )}
                </InputMask>
              </Form.Item>
              <Form.Item
                label="Todos da casa gostam de animais:"
                name="gostamAnimais"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.gostamAnimais}
                  onChange={(value) => handleChange('gostamAnimais', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Todos da casa estão de acordo com a adoção:"
                name="aprovacaoAdocao"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.aprovacaoAdocao}
                  onChange={(value) => handleChange('aprovacaoAdocao', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button style={{ color: '#041E41', border: 'none' }} onClick={prevPage}>
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}>
                  <RightOutlined style={{ marginRight: '5px' }} />
                  Próxima página
                </Button>
              </div>
            </Form>
          </div>
        );

      case 3:
        return (
          <div className={pageClass}>
            <Form layout="vertical" onFinish={onFinish} style={{ padding: '0px 20px', marginTop: "8px" }}>
              <Form.Item
                label="Você tem ou já teve gato ou cachorro?"
                name="historicoPets"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.historicoPets}
                  onChange={(value) => handleChange('historicoPets', value)}
                  style={{ background: '#F0F2F5' }}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>

              {formData.historicoPets === 'Sim' && (
                <>
                  <Form.Item
                    label="Se sim, como ele vive/viveu? Qual sua idade, sexo e comportamento?"
                    name="oQueAconteceu"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, descreva o que aconteceu com ele!' }]}
                  >
                    <Input.TextArea
                      placeholder="Descreva o que aconteceu com o pet"
                      value={formData.oQueAconteceu}

                      onChange={(e) => handleChange('oQueAconteceu', e.target.value)}
                      style={{ background: '#F0F2F5' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tem histórico de morte de animalzinho na sua casa?"
                    name="historicoMorte"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
                  >
                    <Select
                      placeholder="Selecione"
                      value={formData.historicoMorte}
                      onChange={(value) => handleChange('historicoMorte', value)}
                      style={{ background: '#F0F2F5' }}
                    >
                      <Select.Option value="Sim">Sim</Select.Option>
                      <Select.Option value="Não">Não</Select.Option>
                    </Select>
                  </Form.Item>

                  {formData.historicoMorte === 'Sim' && (
                    <Form.Item
                      label="Se sim, o que aconteceu com ele?"
                      name="oQueAconteceuMorte"
                      className='campos'
                      rules={[{ required: true, message: 'Por favor, descreva o que aconteceu com ele!' }]}
                    >
                      <Input.TextArea
                        placeholder="Descreva o que aconteceu com o animal"
                        value={formData.oQueAconteceuMorte}
                        onChange={(e) => handleChange('oQueAconteceuMorte', e.target.value)}
                        style={{ background: '#F0F2F5' }}
                      />
                    </Form.Item>
                  )}

                  <Form.Item
                    label="Qual ração você dá ou dava?"
                    name="racao"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, insira o tipo de ração!' }]}
                  >
                    <Input
                      placeholder="Informe a ração"
                      value={formData.racao}
                      onChange={(e) => handleChange('racao', e.target.value)}
                      style={{ background: '#F0F2F5' }}
                    />
                  </Form.Item>
                </>
              )}

              {formData.historicoPets === 'Não' && (
                <Form.Item
                  label="Se nunca teve, está disposto a dar ração de qualidade?"
                  name="dispostoRacao"
                  className='campos'
                  rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
                >
                  <Select
                    placeholder="Selecione"
                    value={formData.dispostoRacao}
                    onChange={(value) => handleChange('dispostoRacao', value)}
                    style={{ background: '#F0F2F5' }}
                  >
                    <Select.Option value="Sim">Sim</Select.Option>
                    <Select.Option value="Não">Não</Select.Option>
                  </Select>
                </Form.Item>
              )}

              {/* Botões de navegação */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  style={{ color: '#041E41', border: 'none' }}
                  onClick={prevPage}
                >
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ marginLeft: '5px', color: '#fff' }} />
                </Button>
              </div>
            </Form>
          </div>
        );

      case 4:
        return (
          <div className={pageClass}>
            <Form layout="vertical" onFinish={onFinish} style={{ padding: '0px 20px', marginTop: "8px" }} >
              <Form.Item
                label={<span style={{ color: 'red', fontWeight: 'bold' }}>Caso adote, em qual situação devolveria o animalzinho? </span>}
                name="devolverAnimal"
                className='campos'

                rules={[{ required: true, message: 'Por favor, descreva em qual situação devolveria o animal!' }]}
              >
                <TextArea
                  placeholder="Descreva a situação"
                  value={formData.devolverAnimal}
                  onChange={(e) => handleChange('devolverAnimal', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>
              <Form.Item
                label="O que você sabe sobre a castração? Acha importante? Por que?"
                name="conhecimentoCastração"
                className='campos'
                rules={[{ required: true, message: 'Por favor, insira sua opinião sobre castração!' }]}
              >
                <TextArea
                  placeholder="Sua resposta"
                  value={formData.conhecimentoCastração}
                  onChange={(e) => handleChange('conhecimentoCastração', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>
              <Form.Item
                label="Está disposto(a) a vacinar anualmente?"
                name="vacinarAnualmente"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.vacinarAnualmente}
                  onChange={(value) => handleChange('vacinarAnualmente', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Compromete-se a castrar em caso de adotar sem estar castrado?"
                name="comprometeCastrar"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.comprometeCastrar}
                  onChange={(value) => handleChange('comprometeCastrar', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  style={{ color: '#041E41', border: 'none' }}
                  onClick={prevPage}
                >
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ marginLeft: '5px' }} />
                </Button>
              </div>
            </Form>
          </div>
        );

      case 5:
        return (
          <div className={pageClass}>
            <Form layout="vertical" onFinish={onFinish} style={{ padding: '0px 20px', marginTop: "8px" }}>
              <Form.Item
                label="Tem alguma clínica veterinária próxima a sua casa?"
                name="clinicaVeterinaria"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.clinicaVeterinaria}
                  onChange={(value) => handleChange('clinicaVeterinaria', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              {/* Campo requerido apenas se "Sim" for selecionado */}
              {formData.clinicaVeterinaria === 'Sim' && (
                <Form.Item
                  label="Se sim, qual o nome?"
                  name="nomeClinica"
                  className='campos'
                  rules={[{ required: true, message: 'Por favor, insira o nome da clínica!' }]}
                >
                  <Input
                    placeholder="Nome da clínica"
                    value={formData.nomeClinica}
                    onChange={(e) => handleChange('nomeClinica', e.target.value)}
                    style={filledStyle}
                  />
                </Form.Item>
              )}
              <Form.Item
                label="Você sabe quais vacinas são necessárias para um gatinho ou cachorrinho filhote? E para um animal adulto que nunca foi vacinado?"
                name="conhecimentoVacinas"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.conhecimentoVacinas}
                  onChange={(value) => handleChange('conhecimentoVacinas', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              {/* Campo requerido apenas se "Sim" for selecionado */}
              {formData.conhecimentoVacinas === 'Sim' && (
                <Form.Item
                  label="Se sim, quais são?"
                  name="quaisVacinas"
                  className='campos'
                  rules={[{ required: true, message: 'Por favor, descreva as vacinas!' }]}
                >
                  <TextArea
                    placeholder="Descreva as vacinas"
                    value={formData.quaisVacinas}
                    onChange={(e) => handleChange('quaisVacinas', e.target.value)}
                    style={filledStyle}
                  />
                </Form.Item>
              )}
              <Form.Item
                label="Em caso de o animalzinho apresentar um mal-estar ou ingerir algo perigoso, o que você faria?"
                name="atitudePerigo"
                className='campos'
                rules={[{ required: true, message: 'Por favor, insira sua resposta!' }]}
              >
                <TextArea
                  placeholder="Sua resposta"
                  value={formData.atitudePerigo}
                  onChange={(e) => handleChange('atitudePerigo', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button style={{ color: '#041E41', border: 'none' }} onClick={prevPage}>
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ color: '#fff', marginLeft: '5px' }} />
                </Button>
              </div>
            </Form>
          </div>
        );


      case 6:
        return (
          <div className={pageClass}>
            <Form layout="vertical" onFinish={onFinish} style={{ padding: '0px 20px', marginTop: "8px" }}>
              <Form.Item
                label="Fale um pouco sobre o seu desejo de ter um animalzinho e, caso já tenha tido um, como era sua relação com ele?"
                name="desejoAnimal"
                className='campos'
                rules={[{ required: true, message: 'Por favor, descreva!' }]}
              >
                <TextArea
                  placeholder="Sua resposta"
                  value={formData.desejoAnimal}
                  onChange={(e) => handleChange('desejoAnimal', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>
              <Form.Item
                label="Sua condição financeira permite dar ração premium ou superpremium e assistência veterinária?"
                name="condicaoFinanceira"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.condicaoFinanceira}
                  onChange={(value) => handleChange('condicaoFinanceira', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Você se importaria de enviar fotos e vídeos do animalzinho para a pessoa que lhe doou?"
                name="enviarFotos"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.enviarFotos}
                  onChange={(value) => handleChange('enviarFotos', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="O animalzinho será criado dentro de casa?"
                name="criadoDentroDeCasa"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.criadoDentroDeCasa}
                  onChange={(value) => handleChange('criadoDentroDeCasa', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>
              {formData.criadoDentroDeCasa === 'Não' && (
                <Form.Item
                  label="Se não, explique aonde ele vai dormir."
                  name="ondeDormir"
                  className='campos'
                  rules={[{ required: true, message: 'Por favor, descreva onde o animal vai dormir!' }]}
                >
                  <TextArea
                    placeholder="Sua resposta"
                    value={formData.ondeDormir}
                    onChange={(e) => handleChange('ondeDormir', e.target.value)}
                    style={filledStyle}
                  />
                </Form.Item>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button style={{ color: '#041E41', border: 'none' }} onClick={prevPage}>
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ color: '#fff', marginLeft: '5px' }} />
                </Button>
              </div>
            </Form>
          </div>
        );

      case 7:
        return (
          <div className={pageClass}>
            <Form
              layout="vertical"
              onFinish={nextPage}
              style={{ padding: '0px 20px', marginTop: "8px" }}
            >
              <Form.Item
                label="Qual a sua profissão?"
                name="profissao"
                className='campos'
                rules={[{ required: true, message: 'Por favor, insira sua profissão!' }]}
              >
                <Input
                  placeholder="Sua profissão"
                  value={formData.profissao}
                  onChange={(e) => handleChange('profissao', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>
              <Form.Item
                label="Como você soube da nossa adoção?"
                name="comoSoube"
                className='campos'
                rules={[{ required: true, message: 'Por favor, descreva como soube!' }]}
              >
                <TextArea
                  placeholder="Sua resposta"
                  value={formData.comoSoube}
                  onChange={(e) => handleChange('comoSoube', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>
              <Form.Item
                label="Você possui automóvel?"
                name="possuiAutomovel"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.possuiAutomovel}
                  onChange={(value) => handleChange('possuiAutomovel', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>

              {/* Botões de navegação */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  style={{ color: '#041E41', border: 'none' }}
                  onClick={prevPage}
                >
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>

                {/* Botão de "Próxima Página" com htmlType submit */}
                <Button
                  type="primary"
                  htmlType="submit" // Garante que o botão submeta o formulário
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ color: '#fff', marginLeft: '5px' }} />
                </Button>
              </div>
            </Form>
          </div>
        );


      case 8:
        return (
          <div className={pageClass}>
            <Form
              layout="vertical"
              onFinish={nextPage}
              style={{ padding: '0px 20px', marginTop: "8px" }}
            >
              <Form.Item
                label="Seu pet de interesse é:"
                name="petInteresse"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione um tipo de pet!' }]}
                initialValue={formData.petInteresse}
              >
                <Select
                  placeholder={`${formData.petInteresse || 'Selecione'}`}
                  value={formData.petInteresse}
                  onChange={(value) => handleChange('petInteresse', value)}
                  disabled
                >
                  <Select.Option value="Cachorro">Cachorro</Select.Option>
                  <Select.Option value="Gato">Gato</Select.Option>
                </Select>
              </Form.Item>


              {/* Perguntas sobre leishmaniose aparecem apenas se "Cachorro" for selecionado */}
              {formData.petInteresse === 'canino' && (
                <>
                  <Form.Item
                    label="Você conhece a leishmaniose?"
                    name="conhecimentoLeishmaniose"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
                  >
                    <Select
                      placeholder="Selecione"
                      value={formData.conhecimentoLeishmaniose}
                      onChange={(value) => handleChange('conhecimentoLeishmaniose', value)}
                      style={filledStyle}
                    >
                      <Select.Option value="Sim">Sim</Select.Option>
                      <Select.Option value="Não">Não</Select.Option>
                    </Select>
                  </Form.Item>

                  {formData.conhecimentoLeishmaniose === 'Sim' && (
                    <Form.Item
                      label="Caso o cachorrinho venha a se contaminar com a leishmaniose, qual seria a sua atitude?"
                      name="atitudeLeishmaniose"
                      className='campos'
                      rules={[{ required: true, message: 'Por favor, insira sua resposta!' }]}
                    >
                      <TextArea
                        placeholder="Sua resposta"
                        value={formData.atitudeLeishmaniose}
                        onChange={(e) => handleChange('atitudeLeishmaniose', e.target.value)}
                        style={filledStyle}
                      />
                    </Form.Item>
                  )}

                  <Form.Item
                    label="Você sabe como prevenir a leishmaniose?"
                    name="prevencaoLeishmaniose"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
                  >
                    <Select
                      placeholder="Selecione"
                      value={formData.prevencaoLeishmaniose}
                      onChange={(value) => handleChange('prevencaoLeishmaniose', value)}
                      style={filledStyle}
                    >
                      <Select.Option value="Sim">Sim</Select.Option>
                      <Select.Option value="Não">Não</Select.Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              {/* Botões de navegação */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  style={{ color: '#041E41', border: 'none' }}
                  onClick={prevPage}
                >
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>

                {/* Botão de "Próxima Página" com htmlType submit */}
                <Button
                  type="primary"
                  htmlType="submit" // Garante que o botão submeta o formulário
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ color: '#fff', marginLeft: '5px' }} />
                </Button>
              </div>
            </Form>
          </div>
        );


      case 9:
        return (
          <div className={pageClass}>
            <Form
              layout="vertical"
              onFinish={nextPage}
              style={{ padding: '0px 20px', marginTop: "8px" }}
            >
              <Form.Item
                label="Você possui animais em casa?"
                name="temAnimais"
                className='campos'
                rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
              >
                <Select
                  placeholder="Selecione"
                  value={formData.temAnimais}
                  onChange={(value) => handleChange('temAnimais', value)}
                  style={filledStyle}
                >
                  <Select.Option value="Sim">Sim</Select.Option>
                  <Select.Option value="Não">Não</Select.Option>
                </Select>
              </Form.Item>

              {formData.temAnimais === 'Sim' && (
                <>
                  <Form.Item
                    label="Quantos animais você possui?"
                    name="quantosAnimais"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, informe a quantidade!' }]}
                  >
                    <Input
                      type="number"
                      placeholder="Número de animais"
                      value={formData.quantosAnimais}
                      onChange={(e) => handleChange('quantosAnimais', e.target.value)}
                      style={filledStyle}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Eles são castrados?"
                    name="saoCastrados"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
                  >
                    <Select
                      placeholder="Selecione"
                      value={formData.saoCastrados}
                      onChange={(value) => handleChange('saoCastrados', value)}
                      style={filledStyle}
                    >
                      <Select.Option value="Sim">Sim</Select.Option>
                      <Select.Option value="Não">Não</Select.Option>
                      <Select.Option value="NemTodos">Nem todos</Select.Option>
                    </Select>
                  </Form.Item>

                  {(formData.saoCastrados === 'Sim' || formData.saoCastrados === 'NemTodos') && (
                    <Form.Item
                      label="Se sim, há quanto tempo?"
                      className='campos'
                      name="tempoCastrados"
                      rules={[{ required: true, message: 'Por favor, informe o tempo!' }]}
                    >
                      <Input
                        placeholder="Tempo em meses/anos"
                        value={formData.tempoCastrados}
                        onChange={(e) => handleChange('tempoCastrados', e.target.value)}
                        style={filledStyle}
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    label="Os animais possuem cartão de vacina?"
                    name="cartoesVacina"
                    className='campos'
                    rules={[{ required: true, message: 'Por favor, selecione uma opção!' }]}
                  >
                    <Select
                      placeholder="Selecione"
                      value={formData.cartoesVacina}
                      onChange={(value) => handleChange('cartoesVacina', value)}
                      style={filledStyle}
                    >
                      <Select.Option value="Sim">Sim</Select.Option>
                      <Select.Option value="Não">Não</Select.Option>
                      <Select.Option value="Nem todos">Nem todos</Select.Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              {/* Botões de navegação */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  style={{ color: '#041E41', border: 'none' }}
                  onClick={prevPage}
                >
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>

                {/* Botão de "Próxima Página" com htmlType submit */}
                <Button
                  type="primary"
                  htmlType="submit" // Garante que o botão submeta o formulário
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ color: '#fff', marginLeft: '5px' }} />
                </Button>
              </div>
            </Form>
          </div>
        );

      case 10:
        return (
          <div className={pageClass}>
            <Form
              layout="vertical"
              onFinish={nextPage}
              style={{ padding: '0px 20px', marginTop: "8px" }}
            >

              {/* Comentário Adicional */}
              <Form.Item
                label="Favor acrescentar qualquer outro comentário que entender como apropriado"
                name="comentarioAdicional"
              >
                <TextArea
                  placeholder="Seu comentário"
                  value={formData.comentarioAdicional}
                  onChange={(e) => handleChange('comentarioAdicional', e.target.value)}
                  style={filledStyle}
                />
              </Form.Item>

              {/* Botões de navegação */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  style={{ color: '#041E41', border: 'none' }}
                  onClick={prevPage}
                >
                  <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                  Página Anterior
                </Button>

                {/* Botão de "Próxima Página" com htmlType submit */}
                <Button
                  type="primary"
                  htmlType="submit" // Submete o formulário para validação
                  style={{ backgroundColor: '#041E41', border: 'none', color: '#fff' }}
                >
                  Próxima página
                  <RightOutlined style={{ color: '#fff', marginLeft: '5px' }} />
                </Button>
              </div>
            </Form>
          </div>
        );

      case 11:
        return (
          <div className={pageClass}>
            <Form layout="vertical"
              style={{ padding: '0px 20px', marginTop: "8px" }}>
              <Form.Item
                label={
                  <span style={{ fontSize: 20 }}>
                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                      Você tem a responsabilidade de saber que o animal tem necessidades
                      fisiológicas, tem que alimentar, beber água limpa, dar banhos (em casa
                      e/ou pet shop), tem noção que você está levando uma criatura que vem de
                      traumas e precisa se alimentar, carinho etc, em outras palavras, o animal
                      que está respondendo, não é um ursinho de pelúcia!
                    </span>
                    <br />
                    Este questionário estará em análise. Vale lembrar que todo animal
                    resgatado, acolhido e recebido pela ADAC, em conjunto com protetores, ONGs
                    e outros parceiros, não terá a sua genética ou histórico garantidos, e não
                    podemos nos responsabilizar por esses fatores.
                  </span>
                }
                name="concordoCiente"
                valuePropName="checked"
                rules={[{ required: true, message: 'Por favor, confirme sua concordância!' }]}
              >
                <Checkbox
                  checked={formData.concordoCiente}
                  onChange={(e) => handleChange('concordoCiente', e.target.checked)}
                >
                  Estou ciente.
                </Checkbox>
              </Form.Item>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button
                style={{ color: '#041E41', border: 'none' }}
                onClick={prevPage}
              >
                <LeftOutlined style={{ color: '#041E41', marginRight: '5px' }} />
                Página Anterior
              </Button>
              <Button
                style={{ color: '#041E41', border: 'none' }}
                onClick={handleEnviarFormulario} // Chama a nova função que junta ambas
                disabled={!formData.concordoCiente} // Disable if checkbox is not checked
              >
                Enviar Formulário
                <IoLogoWhatsapp style={{ color: '#041E41', marginLeft: '5px' }} />
              </Button>
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Adicionando o Menu */}
      <Menu />

      <div className="formulario" style={{ height: '100vh', flex: 1, padding: "1rem" }}>
        {/* Cabeçalho e Divider */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Header headerName={getPageTitle()} />
        </div>
        <Divider />

        {renderPageContent()}

      </div>
    </div>
  );
};
export default Formulario;


