import React from 'react';
import CustomWalletConnectButton from '../../wallet/CustomWalletConnectButton/CustomWalletConnectButton';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.headerBox}>
      <div className={styles.logo}>
        <img src="/hermes_logo.png" alt="Hermes Logo" className={styles.logoImage} />
        <span className={styles.brandName}>Hermes</span>
      </div>

      {/* Remplacer nav par div */}
      <div className={styles.nav}>
        <a href="#docs" className={styles.navItem}>Docs</a>
        <a href="#social" className={styles.navItem}>Social</a>
        <a href="#github" className={styles.navItem}>Github</a>
      </div>

      <CustomWalletConnectButton />
    </div>
  );
};

export default Sidebar;
