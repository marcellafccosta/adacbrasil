import { useState } from 'react';
import { Calendar } from 'antd';

const MyCalendar = () => {
  const [value, setValue] = useState(null);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setValue(date);
  };

  return (
    <div className='data-event-picker' style={{width: '30%', overflow: 'hidden', margin: '1rem'}}>
      <Calendar className='calendar' fullscreen={false} value={value} onChange={onChange} />
    </div>
  );
};

export default MyCalendar;
