import React, { useState, useEffect } from 'react';
import "./success.scss";

const Success = ({text, status}) => {
  const [isActive, setIsActive] = useState(false);

  // After 4 seconds, remove the 'active' class
  useEffect(() => {
    setIsActive(true);
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 4000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <div className={`success-msg ${status ? '' : 'fail'}`}>
      <p>{text}</p>
      <div className={`s-line ${isActive ? 'active' : ''}`}>
        <div className={`s-line-inner ${isActive ? 'active' : ''}`}></div>
      </div>
    </div>
  );
};

export default Success;
