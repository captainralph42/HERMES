import React, { useEffect, useState } from 'react';
import { useWallet } from '@alephium/web3-react';
import styles from './GenerateButton.module.css';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isGenerating: boolean;
  buttonText: string;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading, isGenerating, buttonText }) => {
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
      {isLoading 
        ? 'Minting...'
        : isGenerating 
          ? 'Generating...'
          : !isMounted 
            ? 'Mint'
            : !isConnected 
              ? 'Connect Wallet'
              : buttonText
      }
    </button>
  );
};

export default GenerateButton;
