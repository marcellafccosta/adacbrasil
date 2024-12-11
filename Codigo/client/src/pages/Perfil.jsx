import { useState, useEffect } from 'react';
import { Card, Input, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService.jsx';
import Menu from '../components/Menu';
import '../styles/Perfil.css';
import './CadastroVoluntario.jsx';
import Header from "../components/Header";
import { Divider } from "@mui/material";


const Perfil = () => {

   const user = AuthService.getCurrentUser();
   const id = user.id;

   const navigate = useNavigate();
   const [userData, setUserData] = useState({
      nome: '',
      email: '',
      tel: '',
      CPF: '',
      dataNascimento: '',
      endereco: {
         cep: '',
         logradouro: '',
         numero: '',
         complemento: '',
         bairro: '',
         cidade: '',
         estado: ''
      },
      infovoluntario: {
         profissao: '',
         tempoDisponivel: '',
         contribuicoes: '',
      }
   });

   const [isEditing, setIsEditing] = useState(false); // Controla o estado de edição
   const [isModalVisible, setIsModalVisible] = useState(false); // Controla a visibilidade do modal de exclusão
   const [deleteConfirmation, setDeleteConfirmation] = useState(''); // Armazena o texto de confirmação
   const [isDeleteEnabled, setIsDeleteEnabled] = useState(false); // Controla se o botão de deletar está habilitado

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const response = await fetch(`http://localhost:3000/api/usuario/${id}`);
            const data = await response.json();
            console.log('Dados do usuário:', data);
            setUserData(data || {});
         } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
         }
      };
      fetchUserData();
   }, [id]);

   const saveUpdates = async () => {
      try {
         const formattedDate = userData.dataNascimento
            ? new Date(userData.dataNascimento).toISOString()
            : null;

         const updatedData = {
            nome: userData.nome,
            email: userData.email,
            tel: userData.tel.replace(/[^0-9]/g, ''),
            CPF: userData.CPF.replace(/[^0-9]/g, ''),
            dataNascimento: formattedDate,
            endereco: {
               cep: userData.endereco.cep,
               logradouro: userData.endereco.logradouro,
               numero: userData.endereco.numero,
               complemento: userData.endereco.complemento || '',
               bairro: userData.endereco.bairro,
               cidade: userData.endereco.cidade,
               estado: userData.endereco.estado,
            },
            infovoluntario: {
               profissao: userData.infovoluntario?.profissao || '',
               tempoDisponivel: userData.infovoluntario?.tempoDisponivel || '',
               contribuicoes: userData.infovoluntario?.contribuicoes || '',
            }
         };

         console.log('Dados atualizados para enviar:', updatedData);

         const response = await fetch(`http://localhost:3000/api/usuario/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
         });

         if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro retornado pelo servidor:', errorData);
            throw new Error('Falha na atualização');
         }

         const result = await response.json();
         console.log('Usuário atualizado:', result);
         setIsEditing(false);
      } catch (error) {
         console.error('Erro ao salvar alterações:', error);
      }
   };

   const toggleEditing = () => {
      setIsEditing((prevState) => !prevState);
   };

   const handleConfirmDelete = async () => {
      try {
         const response = await fetch(`http://localhost:3000/api/usuario/${id}`, {
            method: 'DELETE',
         });
         if (response.ok) {
            setIsModalVisible(false);
            Modal.success({
               title: 'Conta deletada com sucesso!',
               content: 'Sua conta foi excluída e você será redirecionado para a página de login.',
               onOk: () => {
                  navigate('/login');
               }
            });
         } else {
            throw new Error('Falha ao deletar a conta');
         }
      } catch (error) {
         console.error('Erro ao deletar conta:', error);
         Modal.error({
            title: 'Erro ao deletar a conta',
            content: 'Ocorreu um erro ao tentar deletar sua conta. Tente novamente mais tarde.',
         });
      }
   };

   const formatDate = (isoDate) => {
      if (!isoDate) return '';
      const date = new Date(isoDate);
      if (isNaN(date)) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Corrigido para '0'
      const year = String(date.getFullYear()); // Mantém o ano completo
      return `${day}/${month}/${year}`;
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      const [category, field] = name.split('.');
      if (category === 'endereco' || category === 'infovoluntario') {
         setUserData((prevState) => ({
            ...prevState,
            [category]: { ...prevState[category], [field]: value }
         }));
      } else {
         setUserData({ ...userData, [name]: value });
      }
   };

   const redirectToVoluntarioCadastro = () => {
      navigate(`/cadastrar-voluntario`);
   };

   const handleDeleteConfirmationChange = (e) => {
      const value = e.target.value;
      setDeleteConfirmation(value);
      setIsDeleteEnabled(value === 'Quero deletar a minha conta');
   };

   return (
      <div className="dashboard-container" style={{ display: "flex" }} >
         <Menu />
         <div style={{ height: '100vh', flex: 1, padding: "1rem" }}>
            <div style={{ display: "flex" }}>
               <Header headerName={'Informações do Perfil'} />
               <Button className='botaoEditar' onClick={toggleEditing}>{isEditing ? 'Cancelar' : 'Editar'}</Button>
            </div>
            <Divider />
            <Card >
               <div className="container-section">
                  <h2>Dados Pessoais</h2>
                  <label><strong>Nome Completo:</strong></label>
                  <Input name="nome" value={userData.nome || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Email:</strong></label>
                  <Input name="email" value={userData.email || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Telefone:</strong></label>
                  <Input name="tel" value={userData.tel || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>CPF:</strong></label>
                  <Input name="CPF" value={userData.CPF || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Data de Nascimento:</strong></label>
                  <Input name="dataNascimento" value={formatDate(userData.dataNascimento || '')} disabled={!isEditing} onChange={handleInputChange} />
               </div>
               <div className="container-section">
                  <h2>Endereço</h2>
                  <label><strong>CEP:</strong></label>
                  <Input name="endereco.cep" value={userData.endereco.cep || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Logradouro:</strong></label>
                  <Input name="endereco.logradouro" value={userData.endereco.logradouro || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Número:</strong></label>
                  <Input name="endereco.numero" value={userData.endereco.numero || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Complemento:</strong></label>
                  <Input name="endereco.complemento" value={userData.endereco.complemento || 'N/A'} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Bairro:</strong></label>
                  <Input name="endereco.bairro" value={userData.endereco.bairro || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Cidade:</strong></label>
                  <Input name="endereco.cidade" value={userData.endereco.cidade || ''} disabled={!isEditing} onChange={handleInputChange} />
                  <label><strong>Estado:</strong></label>
                  <Input name="endereco.estado" value={userData.endereco.estado || ''} disabled={!isEditing} onChange={handleInputChange} />
               </div>
               <div className="container-section">
                  {userData.infovoluntario && userData.infovoluntario.profissao ? (
                     <>
                        <h2>Informações de Voluntariado</h2>
                        <label><strong>Profissão:</strong></label>
                        <Input name="infovoluntario.profissao" value={userData.infovoluntario.profissao || ''} disabled={!isEditing} onChange={handleInputChange} />
                        <label><strong>Horas Disponíveis:</strong></label>
                        <Input name="infovoluntario.tempoDisponivel" value={userData.infovoluntario.tempoDisponivel || ''} disabled={!isEditing} onChange={handleInputChange} />
                        <label><strong>Contribuições:</strong></label>
                        <Input name="infovoluntario.contribuicoes" value={userData.infovoluntario.contribuicoes || ''} disabled={!isEditing} onChange={handleInputChange} />
                     </>
                  ) : (
                     <div className='voluntario'>
                        <p>Você ainda não é voluntário.</p>
                        <Button className='botaoVolunt' onClick={redirectToVoluntarioCadastro}>Cadastre-se como Voluntário</Button>
                     </div>
                  )}
               </div>
               {/* Botão de salvar alterações */}
               {isEditing && (
                  <div className='botao' style={{ marginTop: 20 }}>
                     <Button className='botaoSalvar' onClick={saveUpdates}>Salvar Alterações</Button>
                  </div>
               )}
               <div className='botaoDelete'>
                  <Button className='botaoDeletar' onClick={() => setIsModalVisible(true)}>Deletar Conta</Button>
               </div>

               {/* Modal de confirmação de exclusão */}
               <Modal
                  title="Confirmar Exclusão"
                  visible={isModalVisible}
                  onOk={handleConfirmDelete}
                  onCancel={() => setIsModalVisible(false)}
                  okText="Sim, deletar"
                  cancelText="Cancelar"
                  okButtonProps={{
                     disabled: !isDeleteEnabled, // Desabilita se a frase não for digitada corretamente
                     style: {
                        backgroundColor: isDeleteEnabled ? '#8b0404' : '#d9d9d9', // Muda para cinza quando desabilitado
                        borderColor: isDeleteEnabled ? '#8b0404' : '#d9d9d9',     // Borda cinza quando desabilitado
                        color: 'white'
                     }
                  }}
                  cancelButtonProps={{
                     style: { backgroundColor: '#04448B', borderColor: '#04448B', color: 'white' } // Estilização do botão "Cancelar"
                  }}
               >
                  <div className="deletarConta">
                     <p>Tem certeza de que deseja deletar sua conta? Esta ação é irreversível!</p>
                     <p>Para continuar, escreva a seguinte frase:</p>
                     <p><strong>Quero deletar a minha conta</strong></p>
                  </div>
                  <Input
                     placeholder="Digite a frase aqui"
                     value={deleteConfirmation}
                     onChange={handleDeleteConfirmationChange}
                  />
               </Modal>
            </Card>
         </div>
      </div>
   );
};

export default Perfil;
