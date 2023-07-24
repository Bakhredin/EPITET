'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './page.css';
import Modal from './components/modal/Modal.jsx';
import CursorFollower from './components/modal/CursorFollower.jsx';
import Switch_joke from './components/modal/Switch_joke';
import Mode_switch from './components/modal/Mode_switch';

function Page() {
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [epithetsData, setEpithetsData] = useState([]);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [isQuotes, setIsQuotes] = useState(false);
  const [generatedQuotes, setGeneratedQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Индекс текущего элемента для плавного появления эпитетов
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0); // Индекс текущего элемента для плавного появления цитат
  const MAX_WORDS_IN_QUOTE = 2;
  const MAX_WORDS_IN_MESSAGE = 1;

  useEffect(() => {
    console.log(isNormal);
  }, [isNormal]);

  const Quotes = () => {
    setIsQuotes(!isQuotes);
    console.log(isQuotes);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const toggleInput = () => {
    setShow(!show);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value.trim(); // Remove leading/trailing whitespace
    const words = inputValue.split(/\s+/); // Split the input value by whitespace

    // Check the field type and set the appropriate maximum word limit
    const maxWords = isQuotes ? MAX_WORDS_IN_QUOTE : MAX_WORDS_IN_MESSAGE;

    if (words.length <= maxWords) {
      setInputValue(inputValue); // Update the input value if the word limit is not exceeded
    }
  };

  const handleSubmit = () => {
    // Validation for empty or too short inputs
    const words = inputValue.split(/\s+/);
    const maxWords = isQuotes ? MAX_WORDS_IN_QUOTE : MAX_WORDS_IN_MESSAGE;

    if (words.length === 0 || words.length > maxWords) {
      alert(`Please enter ${isQuotes ? 'two words' : 'one word'} in the input.`);
      return;
    }

    setIsLoading(true);

    if (isQuotes) {
      axios
        .post('http://localhost:8000/quotes', {
          prompt: inputValue,
        })
        .then((response) => {
          console.log(response.data);
          setGeneratedQuotes(response.data.quotes); // Update the state with the generated quotes
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setCurrentQuoteIndex(0); // Обнуляем текущий индекс для цитат перед каждой загрузкой
          setIsLoading(false); // Set isLoading to false after the quotes timer is finished
        });
    } else {
      axios
        .post('http://localhost:8000/message', {
          message: inputValue,
        })
        .then((response) => {
          console.log(response.data);
          const updatedEpithetsData = response.data.epithets.map((epitet) => ({
            epitet,
            isActive: false,
          }));
          setEpithetsData(updatedEpithetsData);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setCurrentIndex(0); // Обнуляем текущий индекс для эпитетов перед каждой загрузкой
          setIsLoading(false); // Set isLoading to false after the epithets timer is finished
        });
    }
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

  // Таймер для появления элементов массива epithetsData
  useEffect(() => {
    const epithetsTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 700); // Пауза между появлением элементов - 1 секунда (1000 мс)

    // Останавливаем таймер для epithetsData, если достигли последнего элемента
    if (currentIndex >= epithetsData.length - 1) {
      clearInterval(epithetsTimer);
    }

    // Очистка таймера при размонтировании компонента
    return () => clearInterval(epithetsTimer);
  }, [currentIndex, epithetsData.length]);

  // Таймер для появления элементов массива generatedQuotes
  useEffect(() => {
    const quotesTimer = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => prevIndex + 1);
    }, 1000); // Пауза между появлением элементов - 1 секунда (1000 мс)

    // Останавливаем таймер для generatedQuotes, если достигли последнего элемента
    if (currentQuoteIndex >= generatedQuotes.length - 1) {
      clearInterval(quotesTimer);
    }

    // Очистка таймера при размонтировании компонента
    return () => clearInterval(quotesTimer);
  }, [currentQuoteIndex, generatedQuotes.length]);

  return (
    <div className={`body ${isLampOn ? 'true' : 'false'}`}>
      <Switch_joke isLampOn={isLampOn} setIsLampOn={setIsLampOn} />
      <Mode_switch isNormal={isNormal} setIsNormal={setIsNormal} />
      <CursorFollower isLampOn={isLampOn} setIsLampOn={setIsLampOn} />
      <div className='container'>
        <div className={`text_epitet ${isLampOn ? 'true' : 'false'} ${isQuotes ? 'qu' : 'ep'}`} onClick={Quotes}>
          <p id='p_epitet' onClick={toggleInput}>{isQuotes ? 'QUOTES' : 'EPITET'}</p>
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
          ) : isQuotes ? (
            <div>
              {generatedQuotes.slice(0, currentQuoteIndex + 1).map((quote, index) => (
                <p key={index} className={`generated-quote animated-item`}>{quote}</p>
              ))}
            </div>
          ) : (
            <div className="epitet-list">
              {epithetsData.slice(0, currentIndex + 1).map((epitetData, index) => (
                <div
                  className={`epitet-item ${selectedContainerIndex === index ? 'active' : ''}`}
                  key={index}
                  onClick={() => handleClick(index)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {epitetData.isActive ? (
                    <div
                      className="epitet-container active"
                      style={{ backgroundColor: epitetData.color }}
                    >
                      <p className="animated-item">{epitetData.epitet}</p>
                    </div>
                  ) : (
                    <p className="animated-item">{epitetData.epitet}</p>
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
        isNormal={isNormal}
      />
    </div>
  );
}

export default Page;
