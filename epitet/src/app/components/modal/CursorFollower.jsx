import React, { useState, useEffect } from 'react';
import './cursorfollower.css';

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      setPosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const lerp = (start, end, t) => {
      return start * (1 - t) + end * t;
    };

    const updateFollowerPosition = () => {
      setFollowerPosition((prevPosition) => {
        const lerpAmount = 0.2; // Adjust the lerp amount for desired responsiveness
        const x = lerp(prevPosition.x, position.x, lerpAmount);
        const y = lerp(prevPosition.y, position.y, lerpAmount);

        // Calculate rotation angle based on cursor position
        const dx = x - prevPosition.x;
        const dy = y - prevPosition.y;
        const newRotation = Math.atan2(dy, dx) * (180 / Math.PI);
        setRotation(newRotation);

        return { x, y };
      });
    };

    const animationFrame = requestAnimationFrame(updateFollowerPosition);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [position]);

  const cursorStyle = {
    left: followerPosition.x,
    top: followerPosition.y,
    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
  };

  return (
    <div className="cursor-follower" style={cursorStyle}>
      <img
        src="./bee.png"
        alt="Cursor Follower"
        className="cursor-image"
      />
    </div>
  );
};

export default CursorFollower;
