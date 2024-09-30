import React from 'react';
import styles from './LoadingPopup.module.css';

interface LoadingPopupProps {
  isVisible: boolean;
  currentStep: string;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ isVisible, currentStep }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Generating your NFT</h2>
        <p>{currentStep}</p>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
};

export default LoadingPopup;
