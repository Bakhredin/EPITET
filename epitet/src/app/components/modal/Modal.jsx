'use client'

import React, { useState } from "react"
import './modal.css';

function Modal() {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div className="font-sans">
      <button onClick={toggleVisible}>Open Modal</button>
      {visible && (
        <div className="modal">
            <button className="createSent">
                Составить предложение
            </button>

            <button className="meaning_epitet">
                Описать эпитет
            </button>
          <div className="modal-actions">
            <button onClick={toggleVisible}>x</button>
          </div>
        </div>
      )}
    </div>
  )
}


export default Modal