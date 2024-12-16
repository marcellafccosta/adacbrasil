/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button, Form, Input } from "antd";
import { useProfanityChecker } from 'glin-profanity';
import '../styles/FeedbackSection.css'

const { TextArea } = Input;

const NovoFeedback = ({ addFeedback, notifySuccess, notifyError }) => {
  const [newFeedback, setNewFeedback] = useState({ text: '', author: '' });

  // Profanity checker state
  const [checkAllLanguages] = useState(true);
  const [caseSensitive] = useState(false);
  const [wordBoundaries] = useState(true);
  const [customWords] = useState([]);

  const { result, checkText } = useProfanityChecker({
    allLanguages: checkAllLanguages,
    caseSensitive: caseSensitive,
    wordBoundaries: wordBoundaries,
    customWords: customWords,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback({ ...newFeedback, [name]: value });
  };

  const handleProfanityCheck = () => {
    checkText(newFeedback.text);
  };

  const handleSubmit = async () => {
    if (result && result.containsProfanity) {
      const bannedWords = result.profaneWords.join(', ');
      notifyError(`Seu feedback contém linguagem imprópria: ${bannedWords}`);
      return;
    }

    const feedback = {
      text: newFeedback.text.trim(),
      author: newFeedback.author.trim(),
    };
  
    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
  
      if (response.ok) {
        notifySuccess();
        addFeedback(feedback);
        setNewFeedback({ text: "", author: "" });
      } else {
        notifyError();
      }
    } catch (error) {
      notifyError();
    }
  };

  return (
    <Form
      className="feedback-form"
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Seu nome"
        name="author"
        rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
        style={{width: '100%'}}
      >
        <Input
          name="author"
          placeholder="Seu nome"
          value={newFeedback.author}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Sua experiência"
        name="text"
        rules={[{ required: true, message: 'Por favor, escreva seu feedback!' }]}
      >
        <TextArea
          name="text"
          rows={4}
          placeholder="Escreva sua experiência com a gente!"
          value={newFeedback.text}
          onChange={handleChange}
          onBlur={handleProfanityCheck} // Trigger profanity check on blur
        />
      </Form.Item>

      {result && result.containsProfanity && (
        <div style={{ color: 'red' }}>
          <p>Seu feedback contém linguagem imprópria: {result.profaneWords.join(', ')}</p>
        </div>
      )}

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          className="botaoFeedback" 
        >
          Enviar feedback
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NovoFeedback;
