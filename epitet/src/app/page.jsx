'use client'

import React, { useState } from 'react';
import axios from 'axios';
import './page.css';
import Modal from './components/modal/Modal.jsx'

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [epithetsData, setEpithetsData] = useState([]);
  const [sentences, setSentences] = useState([]);

  const toggleInput = () => {
    setShow(!show);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .post('http://localhost:8000/message', {
        message: inputValue
      })
      .then((response) => {
        console.log(response.data);
        const updatedEpithetsData = response.data.epithets.map((epitet) => ({
          epitet,
          isActive: false
        }));
        setEpithetsData(updatedEpithetsData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClick = (index) => {
    const selectedElement = epithetsData[index];

    const updatedEpithetsData = epithetsData.map((epitetData, i) => ({
      ...epitetData,
      isActive: i === index,
    }));

    setEpithetsData(updatedEpithetsData);

    console.log(`Эпитет ${selectedElement.epitet} превращен в контейнер`);

    axios
      .post('http://localhost:8000/generate', {
        prompt: inputValue,
        epitet: selectedElement.epitet,
      })
      .then((response) => {
        console.log(response.data);
        setSentences(response.data.sentences);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

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
              {epithetsData.map((epitetData, index) => (
                <div
                  className={`epitet-item ${epitetData.isActive ? 'active' : ''}`}
                  key={index}
                  onClick={() => handleClick(index)}
                >
                  {epitetData.isActive ? (
                    <div
                      className="epitet-container active"
                      style={{ backgroundColor: epitetData.color }}
                    >
                      <p>{epitetData.epitet}</p>
                    </div>
                  ) : (
                    <p>{epitetData.epitet}</p>
                  )}
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
      <Modal />
    </div>
  );
};

export default Page;
