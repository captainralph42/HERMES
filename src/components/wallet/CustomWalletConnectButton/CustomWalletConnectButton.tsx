import React, { useState } from 'react';
import { AlephiumConnectButton } from '@alephium/web3-react';
import styles from './CustomWalletConnectButton.module.css';

const CustomWalletConnectButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const truncateAddress = (address: string | undefined) => {
    if (!address) return '';
    const start = address.slice(0, 4);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  return (
    <AlephiumConnectButton.Custom>
      {({ isConnected, disconnect, show, account }) => {
        return isConnected ? (
          <button
            className={`${styles.customButton} ${isHovered ? styles.hovered : ''}`}
            onClick={disconnect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className={styles.text}>{truncateAddress(account?.address)}</span>
            <span className={styles.hoverText}>Disconnect</span>
          </button>
        ) : (
          <button className={styles.customButton} onClick={show}>
            Connect Wallet
          </button>
        );
      }}
    </AlephiumConnectButton.Custom>
  );
};

export default CustomWalletConnectButton;
