import React, { useEffect, useState } from 'react';
import { useWallet } from '@alephium/web3-react'; 
import styles from './GenerateButton.module.css';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading }) => {
  const { account } = useWallet();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isConnected = !!account;

  return (
    <button
      onClick={onClick}
      disabled={isLoading || !isConnected || !isMounted}
      className={styles.generateButton}
    >
      {isLoading ? 'Minting...' : isMounted ? (isConnected ? 'Mint' : 'Connect Wallet') : 'Mint'}
    </button>
  );
};

export default GenerateButton;
