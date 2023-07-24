'use client'

import React from "react";
import './mode_switch.css';

function ModeSwitch({ isNormal, setIsNormal }) {
  const handleSwitchMode = (newMode) => {
    setIsNormal(newMode);
  };

  return (
    <div className="menu-wrap">
      <input type="checkbox" className="toggler" />
      <label className="hamburger" htmlFor="menu-toggle">
        <img
          className={`hamburger-image ${isNormal ? 'true' : 'false'}`}
          src={isNormal ? 'smile.png' : 'clown.png'}
          alt=""
        />
      </label>
      <div className="menu">
        <div>
          <div>
            <ul>
              <li>
                <div
                  className="photo_joke"
                  onClick={() => handleSwitchMode(false)}
                >
                  <img src="./clown_mem.png" alt="" />
                  <div className="text_joke">
                    <a id="text">Шуточная версия</a>
                  </div>
                </div>
              </li>
              <li>
                <div
                  className="photo_normal"
                  onClick={() => handleSwitchMode(true)}
                >
                  <img src="./smile_mem.png" alt="" />
                  <div className="text_normal">
                    <a id="text">Нормальная версия</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

}

export default ModeSwitch;
