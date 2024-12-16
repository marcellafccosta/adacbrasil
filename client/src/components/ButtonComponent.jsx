/* eslint-disable react/prop-types */
import '../styles/CalendarEventPicker.css';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddButton = ({ onClick, title, backgroundColor }) => {
  return (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      shape="default"
      aria-label={title}
      onClick={onClick}
      style={{ width: '20vw', height: '60px', backgroundColor }}
    >
      {title}
    </Button>
  );
};

export default AddButton;
