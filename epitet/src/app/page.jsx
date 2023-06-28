'use client'


import React, { useEffect, useState } from 'react';
import styles from './page.css';
import axios from 'axios';

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [responseEpitets, setResponseEpitets] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки

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
        setResponseEpitets(response.data.messages);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false); // Сброс состояния загрузки после получения ответа или ошибки
      });
  };

  const handleClick = (epitet) => {
    axios
      .post('http://localhost:8000/generate', {
        prompt: inputValue,
        epitet: epitet
      })
      .then((response) => {
        console.log(response.data);
        // Handle the generated sentences here
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

  return (
    <div>
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
            <p>Загрузка...</p> // Отображение сообщения о загрузке во время выполнения запроса
          ) : (
            responseEpitets.map((epitet, index) => (
              <p key={index} onClick={() => handleClick(epitet)}>
                {epitet}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
