'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.css';
import axios from 'axios';

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  cons
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
    axios
      .post('http://localhost:8000/generate', {
        prompt: inputValue,
        epitet: epitet
      })
      .then((response) => {
        console.log(response.data);
        setSentences(response.data.sentences);
        console.log(sentences);
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
            responseEpitets.map((epitet, index) => (
              <div className="wrapper">
                <p key={index} onClick={() => handleClick(epitet)}>
                  {epitet}
                </p>
              </div>
            ))
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