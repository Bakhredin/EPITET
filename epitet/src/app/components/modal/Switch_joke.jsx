import React, { useState } from "react";
import './switch_joke.css';

function Switch_joke({ isLampOn, setIsLampOn }) {

  const handleSwitchChange = () => {
    const newIsOn = !isLampOn;
    setIsLampOn(newIsOn);
    console.log(isLampOn);
  };

  return (
    <div id="lamp" className={isLampOn ? "lamp-on" : ""}>
      <input type="checkbox" id="switch" name="switch" />
      <label htmlFor="switch" className="switch"></label>
      <input
        type="radio"
        className="switch-on"
        name="switch"
        value="on"
        checked={isLampOn}
        onChange={handleSwitchChange}
      />

      <input
        type="radio"
        className="switch-off"
        name="switch"
        value="off"
        checked={!isLampOn}
        onChange={handleSwitchChange}
      />
      <label htmlFor="switch-on" className={`entypo-lamp ${isLampOn ? 'on' : 'off'}`}></label>
      <div className={`lamp ${isLampOn ? 'on' : 'off'}`}>
        <div className="gonna-give-light"></div>
      </div>
    </div>
  );

}

export default Switch_joke;
