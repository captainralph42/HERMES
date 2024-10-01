import React from 'react';
import Link from 'next/link';
import CustomWalletConnectButton from '../../wallet/CustomWalletConnectButton/CustomWalletConnectButton';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.headerBox}>
      <div className={styles.logo}>
        <img src="/hermes_logo.png" alt="Hermes Logo" className={styles.logoImage} />
        <span className={styles.brandName}>Hermes</span>
      </div>

      <div className={styles.nav}>
        <Link href="/docs" className={styles.navItem}>Docs</Link>
        <a href="https://x.com/Hermes_alph" className={styles.navItem} target="_blank" rel="noopener noreferrer">Social</a>
        <a href="https://github.com/captainralph42/HERMES" className={styles.navItem} target="_blank" rel="noopener noreferrer">Github</a>
      </div>

      <CustomWalletConnectButton />
    </div>
  );
};

export default Sidebar;
