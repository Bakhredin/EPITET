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
      <label for="switch" class="switch"></label>
      <input
        type="radio"
        id="switch-on"
        name="switch"
        value="on"
        checked={isLampOn}
        onChange={handleSwitchChange}
      />
      <input
        type="radio"
        id="switch-off"
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
