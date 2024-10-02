import React from 'react';
import TotalSupply from '@/components/TotalSupply';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Total NFTs Minted: <TotalSupply /></p>
      <p>This dApp was created as part of Hackathon 1.5 by Just1 and CaptainRalph.</p>
      <p>v.0.0.2 testnet</p>
    </footer>
  );
};

export default Footer;
