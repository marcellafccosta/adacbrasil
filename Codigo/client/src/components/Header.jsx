/* eslint-disable react/prop-types */
import '../styles/Header.css';

const Header = ({ headerName }) => {
  return (
    <header className="header-container">
      <h1 className="header-title">{headerName}</h1>
      <hr className="header-divider" />
    </header>
  );
};

export default Header;
