'use client'

import React, { useState } from 'react';
import axios from 'axios';
import './page.css';
import Modal from './components/modal/Modal.jsx'
import CursorFollower from './components/modal/CursorFollower.jsx';
import Switch_joke from './components/modal/Switch_joke'

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [epithetsData, setEpithetsData] = useState([]);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);


  const openModal = () => {
    setModalVisible(true);
  }


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

    setSelectedContainerIndex(index);
    openModal();
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`body ${isLampOn ? 'true' : 'false'}`}>
      <Switch_joke
      isLampOn={isLampOn}
      setIsLampOn={setIsLampOn}
      />
       <CursorFollower
       isLampOn={isLampOn}
       setIsLampOn={setIsLampOn}
       />
      <div className='container'>
        <div className={`text_epitet ${isLampOn ? 'true' : 'false'}`}>
          <p id='p_epitet' onClick={toggleInput}>EPITET</p>
        </div>
        <div className={`search ${show ? 'show' : 'hide'} ${isLampOn ? 'true' : 'false'}`}>
          <input
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder='Введите слово'
            className={`input ${isLampOn ? 'true' : 'false'}`}
            type='text'
          />

        </div>
        <div className={`epitets-container ${isLampOn ? 'true' : 'false'}`}>
          {isLoading ? (
            <p>Загрузка...</p>
          ) : (
            <div className="epitet-list">
              {epithetsData.map((epitetData, index) => (
                <div
                  className={`epitet-item ${selectedContainerIndex === index ? 'active' : ''}`}
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
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedContainerIndex={selectedContainerIndex}
        inputValue={inputValue} 
        isLampOn={isLampOn}
        />
    </div>
  );
};

export default Page;
