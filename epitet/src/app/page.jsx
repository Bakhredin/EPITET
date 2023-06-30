'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.css';
import axios from 'axios';

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [responseEpitets, setResponseEpitets] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const [sentences, setSentences] = useState([]);
  const [visibleSentence, setVisiibleSentence] = useState(true);
  const [activeEpitet, setActiveEpitet] = useState(null);

  const toggleInput = () => {
    setShow(!show);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true); // Установка состояния загрузки при отправке запроса
    axios
      .post('http://localhost:8000/message', {
        message: inputValue
      })
      .then((response) => {
        console.log(response.data);
        setResponseEpitets(response.data.epithets); // Updated response key to "epithets"
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false); // Сброс состояния загрузки после получения ответа или ошибки
      });
  };

  const handleClick = (epitet) => {
    setActiveEpitet(epitet); // Установка активного эпитета при клике
    axios
      .post('http://localhost:8000/generate', {
        prompt: inputValue,
        epitet: epitet
      })
      .then((response) => {
        console.log(response.data);
        setSentences(response.data.sentences);
      })
      .catch((error) => {
        console.error(error);
      })
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSentenceClick = () => {
    setVisiibleSentence(false);
  }

  return (
    <div className='body'>
      <div className='container'>
        <div className='text_epitet'>
          <p id='p_epitet' onClick={toggleInput}>EPITET</p>
        </div>
        <div className={`search ${show ? 'show' : 'hide'}`}>
          <input
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder='Введите слово'
            className='input'
            type='text'
          />
        </div>
        <div className='epitets-container'>
          {isLoading ? (
            <p>Загрузка...</p>
          ) : (
            <div className="epitet-list">
              {responseEpitets.map((epitet, index) => (
                <div
                  className={`epitet-item ${activeEpitet === epitet ? 'active' : ''}`}
                  key={index}
                  onClick={() => handleClick(epitet)}
                >
                  <p>{epitet}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="sentences">
        {visibleSentence && sentences.map((sentence, index) => (
          <p key={index} onClick={handleSentenceClick}>{sentence}</p>
        ))}
      </div>
    </div>
  );
  

}

export default Page;