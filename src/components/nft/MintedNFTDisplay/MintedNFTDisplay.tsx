import React from 'react';
import styles from './MintedNFTDisplay.module.css';

interface MintedNFTDisplayProps {
  nftImageUrl: string | null;
  isLoading: boolean;
  currentStep: string;
  isAwaitingConfirmation: boolean;
}

const MintedNFTDisplay: React.FC<MintedNFTDisplayProps> = ({
  nftImageUrl,
  isLoading,
  currentStep,
  isAwaitingConfirmation,
}) => {
  return (
    <div className={styles.nftBox}>
      {currentStep ? (
        <div className={styles.loadingBox}>
          <p>{currentStep}</p>
        </div>
      ) : nftImageUrl ? (
        <img src={nftImageUrl} alt="NFT" className={styles.nftImage} />
      ) : (
        <p className={styles.placeholderText}>Mint your first NFT!</p>
      )}
    </div>
  );
};

export default MintedNFTDisplay;
