import React, { useState, useEffect } from 'react';
import styles from './Popup.module.css';

const Popup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return isVisible ? (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>Welcome to Hermes!</h2>
        <p>
          Our dApp is currently in the final stages of development and running on the testnet. 
          For the best experience, we recommend connecting with your desktop wallet or using 
          WalletConnect temporarily. Thank you for your understanding and patience as we finalize 
          the last details!
        </p>
        <button className={styles.closeButton} onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default Popup;
