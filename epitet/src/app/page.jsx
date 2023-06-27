'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.css';
import axios from 'axios';

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [responseEpitets, setResponseEpitets] = useState([]);

  const toggleInput = () => {
    setShow(!show);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8000/message', {
      message: inputValue
    })
      .then(response => {
        console.log(response.data);
        setResponseEpitets(response.data.messages);
      })
      .catch(error => {
        console.error(error);
      });
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
          <input onChange={handleInputChange}  onKeyPress={handleKeyPress}  placeholder='Введите слово' className='input' type="text" />
        </div>
      </div>

      <div className="epitets-container">
        {responseEpitets.map((epitet, index) => (
          <p key={index}>{epitet}</p>
        ))}
      </div>
    </div>
  );
}

export default Page;
