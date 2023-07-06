import React, { useEffect, useRef } from "react";
import axios from 'axios';
import './modal.css';

function Modal({ visible, onClose, selectedContainerIndex, inputValue }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      positionModal();
    }
  }, [visible]);

  const handleModalClose = () => {
    onClose();
  };

  const handleCreateSentence = () => {
    const prompt = inputValue;
    const epitet = document.getElementsByClassName('epitet-item')[selectedContainerIndex].textContent;

    axios.post('http://localhost:8000/generate', {
      prompt: inputValue,
      epitet: epitet
    })
      .then((response) => {
        const sentences = response.data.sentences;
        //здесь потом можно поиграться !!!!
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const positionModal = () => {
    const containerElement = document.getElementsByClassName('epitet-item')[selectedContainerIndex];
    const containerRect = containerElement.getBoundingClientRect();
    const modalElement = modalRef.current;
    const modalRect = modalElement.getBoundingClientRect();

    const top = containerRect.top + window.scrollY + containerRect.height + 10;
    const left = containerRect.left + window.scrollX + (containerRect.width / 2) - (modalRect.width / 2) + 150;

    modalElement.style.top = `${top}px`;
    modalElement.style.left = `${left}px`;
  };

  return (
    <div ref={modalRef} className={`modal ${visible ? 'show' : 'hide'}`}>
      {selectedContainerIndex !== null && (
        <div className="modal-content">
          <div className="create">
            <button className="create_button" onClick={handleCreateSentence}>
              СОЗДАТЬ ПРЕДЛОЖЕНИЕ
            </button>
          </div>


          <div className="meaning">
            <button className="epitets_button">ОПИСАТЬ ЭПИТЕТ</button>
          </div>

          {/* Например, если у вас есть sentences, вы можете отобразить их в модальном окне: */}
          {/* {sentences.map((sentence, index) => <p key={index}>{sentence}</p>)} */}
        </div>
      )}
      <div className="modal-actions">
        <button className="x" onClick={handleModalClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 10.586L4.707 3.293L3.293 4.707L10.586 12L3.293 19.293L4.707 20.707L12 13.414L19.293 20.707L20.707 19.293L13.414 12L20.707 4.707L19.293 3.293L12 10.586Z"
              fill="#ffffff"
            />
          </svg>
        </button>
      </div>
    </div>

  );
}

export default Modal;
