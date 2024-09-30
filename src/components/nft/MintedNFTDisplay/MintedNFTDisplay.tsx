import React from 'react';
import styles from './MintedNFTDisplay.module.css';

interface MintedNFTDisplayProps {
  nftImageUrl: string | null;
  isLoading: boolean;
  currentStep: string;
}

const MintedNFTDisplay: React.FC<MintedNFTDisplayProps> = ({ nftImageUrl, isLoading, currentStep }) => {
  return (
    <div className={styles.nftBox}>
      {isLoading ? (
        <div className={styles.loadingBox}>
          <p>{currentStep}</p>
          <div className={styles.loader}></div>
        </div>
      ) : (
        nftImageUrl ? (
          <img src={nftImageUrl} alt="NFT" className={styles.nftImage} />
        ) : (
          <p className={styles.placeholderText}>Connect your wallet to mint</p>
        )
      )}
    </div>
  );
};

export default MintedNFTDisplay;
