import React, { useState } from "react";
import './switch_joke.css';

function Switch_joke({ lamp }) {
  const [isOn, setIsOn] = useState(lamp);

  const handleSwitchChange = () => {
    const newIsOn = !isOn;
    setIsOn(newIsOn);
  };

  return (
    <div id="lamp" className={isOn ? "lamp-on" : ""}>
      <input
        type="radio"
        id="switch-on"
        name="switch"
        value="on"
        checked={isOn}
        onChange={handleSwitchChange}
      />
      <input
        type="radio"
        id="switch-off"
        name="switch"
        value="off"
        checked={!isOn}
        onChange={handleSwitchChange}
      />
      <label htmlFor="switch-on" className={`entypo-lamp ${isOn ? 'on' : 'off'}`}></label>
      <div className={`lamp ${isOn ? 'on' : 'off'}`}>
        <div className="gonna-give-light"></div>
      </div>

    </div>
  );

}

export default Switch_joke;
