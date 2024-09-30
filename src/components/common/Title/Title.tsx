// src/components/Title.tsx
import React from 'react';
import styles from './Title.module.css';

const Title: React.FC = () => {
  return (
    <div className={styles.titleBox}>
      <h1 className={styles.title}>
      Unleash Your Punchline, Mint It as an NFT
      </h1>
    </div>
  );
};

export default Title;
