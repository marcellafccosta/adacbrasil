import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchBar = ({ onSearch }) => {
    const handleInputChange = (event) => {
        const searchText = event.target.value;
        onSearch(searchText); 
    };

    return (
        <div className="search-bar" style={{ marginLeft: '3vw', width: '100%' }}>
            <Input
                placeholder="Buscar voluntário pelo nome"
                className="search-input"
                prefix={<SearchOutlined />}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default SearchBar;
