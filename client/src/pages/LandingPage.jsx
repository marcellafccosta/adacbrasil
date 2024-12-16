import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import dog from '../assets/LandingPage/main-dog.png';
import voluntario from '../assets/pqvolunt.png';
import adotar from '../assets/LandingPage/adotar.png';
import Logo from '../assets/adaclogoredonda.png';
import '../styles/LandingPage.css';
import FeedbackSection from '../components/FeedbackSection';
import PatrocinioSection from '../components/PatrocinioSection';
import { Button } from "antd";
import AuthService from '../services/AuthService';

const LandingPage = () => {
  const navigate = useNavigate();
  const volunteerSectionRef = useRef(null);
  const adoptSectionRef = useRef(null);

  const scrollToVolunteerSection = () => {
    volunteerSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAdoptSection = () => {
    adoptSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };


  const Header = () => {
    const userLoggedIn = AuthService.getCurrentUser(); // Verifica se o usuário está logado

    return (
      <header className="header">
        <img src={Logo} alt="Logo ADAC" className="logo" />
        <nav>
          <ul className="menu">
            <li><a href="#adocao" onClick={scrollToAdoptSection}>Adote!</a></li>
            <li><a href="#voluntario" onClick={scrollToVolunteerSection}>Seja voluntário</a></li>
            <li><Link to="/Calendar">Calendário</Link></li>
            <li>
              <a
                href="https://wa.me/5531999927121"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contato
              </a>
            </li>

          </ul>
        </nav>
        <div className="auth-buttons">
          {userLoggedIn ? (
            <div className="profile-icon" onClick={() => navigate("/perfil")}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Ícone de perfil"
                style={{ width: '40px', cursor: 'pointer' }}
              />
            </div>
          ) : (
            <>
              <Button
                className="botao-login"
                type="primary"
                style={{ margin: '1rem' }}
                onClick={() => navigate("/Login")}
              >
                Entrar
              </Button>
              <Button
                className="botao-cadastro"
                type="primary"
                style={{ margin: '1rem' }}
                onClick={() => navigate("/Cadastro")}
              >
                Cadastrar
              </Button>
            </>
          )}
        </div>
      </header>
    );
  };


  const Banner = () => {
    return (
      <section className="hero-section">
        <div className="container">
          <div className="content">
            <div className="text-content">
              <h1 className="text-content-title">ADAC - Dog Anjos Cat</h1>
              <p className="hero-description">
                Somos uma associação que dá suporte para animais em situação de abandono e maus-tratos e seus
                donos. Realizamos ações para ajudar e conscientizar acumuladores de animais. Fazemos mediação
                para adoção de animais.
              </p>
              <Button
                type="primary"
                href="https://adac.apoiar.co/2"
                aria-label="Doe para ajudar animais em situação de abandono"
                className="donate-btn"
              >
                Doe!
              </Button>
            </div>
            <div className="image-content">
              <img
                alt="Cachorro usando óculos de sol"
                className="main-img"
                src={dog}
              />
            </div>
          </div>
        </div>
      </section>
    );
  };
  

  const Actions = () => {

    const services = [
      {
        title: "Adote um Pet",
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2da45d436bde230d67a3fe52e07b8a46933ef207b3e65b5ecbe4d379fef3de05?placeholderIfAbsent=true&apiKey=aa99ff00a10f4af2b8ec8267c7952fc6",
        path: "/Pets",
      },
      {
        title: "Doação",
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dcf996284376601c338f1928fea07bbbb6c1552b5b65b6f4a1dc56323f49c3fc?placeholderIfAbsent=true&apiKey=aa99ff00a10f4af2b8ec8267c7952fc6",
        href: "https://adac.apoiar.co/2",
      },
      {
        title: "Eventos",
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef9eaf0bbc74bf04189fd34678878640064a7bfe2606889b6b11b84a799e880e?placeholderIfAbsent=true&apiKey=aa99ff00a10f4af2b8ec8267c7952fc6",
        path: "/calendar",
      },
      {
        title: "Seja Voluntário",
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/0650724123682fc1f97753d7b9e86d493d12f9dff8fa016774dca2653034ce30?placeholderIfAbsent=true&apiKey=aa99ff00a10f4af2b8ec8267c7952fc6",
        path: "/cadastrar-voluntario",
      },
    ];

    const navigate = useNavigate();

    const handleNavigation = (service) => {
      if (service.href) {
        window.open(service.href, "_blank"); 
      } else if (service.path) {
        navigate(service.path); 
      }
    };

    return (
      <section className="services-section">
        <div className="services-heading">
          <h2>Participe e Apoie</h2>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e58501e0fcab8160b8c16a070e77d639904bcb58108b973b36fd0f704fa1b7d2?placeholderIfAbsent=true&apiKey=aa99ff00a10f4af2b8ec8267c7952fc6"
            alt="Heading underline"
            className="service-heading-underline"
          />
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              className="service-card"
              key={index}
              onClick={() => handleNavigation(service)}
            >
              <img src={service.icon} alt={`${service.title} icon`} className="service-icon" />
              <h3 className="service-title">{service.title}</h3>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const VolunteerSection = () => {
    return (
      <section ref={volunteerSectionRef} className="volunteer-section">
        <div className="container-volunteer">
          <div className="image-content">
            <img alt="Person with dog"
              src={voluntario}
              width="600" height="600" />
          </div>
          <div className="text-content-volunteer" style={{width:"50%"}}>
            <h2>Por que ser voluntário?</h2>
            <p>
              <strong>Contribuir para o Bem-Estar Animal: </strong>
              Ao ser voluntário, você ajuda a garantir que animais abandonados ou maltratados recebam os cuidados necessários, como alimentação, abrigo e tratamento médico, proporcionando-lhes uma vida mais digna.
            </p>
            <p>
              <strong>Desenvolvimento Pessoal: </strong>
              O voluntariado em uma ONG de animais permite desenvolver habilidades como empatia, responsabilidade, e trabalho em equipe, além de proporcionar uma sensação de propósito ao fazer a diferença na vida de seres vivos.
            </p>
            <p>
              <strong>Criar Comunidade: </strong>
              Ser voluntário permite conhecer pessoas com os mesmos valores e paixões, criando uma rede de apoio e amizade baseada em um objetivo comum: a proteção e o cuidado dos animais.
            </p>
            <Button className="feedback-button" type="primary" onClick={() => navigate("/cadastrar-voluntario")}> Seja voluntário!</Button>
          </div>
        </div>
      </section>
    );
  };

  const AdoptSection = () => {
    return (
      <section ref={adoptSectionRef} className="adopt-section">
        <div className="container-adopt">
          <div className="adopt-text-content">
            <div className="adopt-text-content-title">
              <h2>Por que adotar um Pet?</h2>
            </div>
            <p>
              Adotar um pet é um gesto de amor que transforma vidas. Além de oferecer um lar para um animal em busca de carinho, você ganha um companheiro fiel que traz alegria e afeto. Ao adotar, você também contribui para a redução do número de animais abandonados e fortalece o ciclo de cuidado e respeito com os animais.
              <strong> Adotar é salvar e ser salvo!</strong>
            </p>
            <Button className="feedback-button" type="primary" onClick={() => navigate("/Pets")}>Adote!</Button>
          </div>
          <div className="image-content">
            <img alt="Person with dog"
              src={adotar}
              width="400" height="500" />
          </div>
        </div>
      </section>
    );
  };


  const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-logo">
          <img src={Logo} alt="Logo ADAC" className="logo" />
        </div>
        <p>© 2024 ADAC - Dog Anjos Cat. Todos os direitos reservados.</p>
      </footer>
    );
  };

  return (
    <div>
      <Header />
      <Banner />
      <Actions />
      <AdoptSection />
      <VolunteerSection />
      <FeedbackSection />
      <PatrocinioSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
