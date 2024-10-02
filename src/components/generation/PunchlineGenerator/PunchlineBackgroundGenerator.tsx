import React, { useState, useEffect } from 'react';
import MintedNFTDisplay from '../../nft/MintedNFTDisplay/MintedNFTDisplay';
import ControlPanel from '../ControlPanel/ControlPanel';
import { useWallet } from '@alephium/web3-react'; 
import { HermesCollectionNFTInstance } from 'artifacts/ts';
import { ONE_ALPH, stringToHex } from '@alephium/web3'; 
import { v4 as uuidv4 } from 'uuid';
import styles from './PunchlineBackgroundGenerator.module.css';

const PunchlineBackgroundGenerator: React.FC = () => {
  const wallet = useWallet();
  const [humor, setHumor] = useState(50);
  const [love, setLove] = useState(50);
  const [subtlety, setSubtlety] = useState(50);
  const [length, setLength] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');

  const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID || '';

  useEffect(() => {
    setUuid(uuidv4()); 
  }, [isGenerating]);

  const handleGenerateAndMint = async () => {
    setIsGenerating(true);
    setCurrentStep('Generating punchline...');

    try {
      if (!wallet?.signer) {
        alert('Wallet not connected. Please connect your wallet.');
        setIsGenerating(false);
        return;
      }

      const punchlineResponse = await fetch('/api/generate-punchline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humor, love, subtlety, length, uuid }),
      });

      if (!punchlineResponse.ok) {
        throw new Error('Failed to generate punchline');
      }

      const { punchline } = await punchlineResponse.json();

      setCurrentStep('Generating background...');

      const backgroundResponse = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid }),
      });

      if (!backgroundResponse.ok) {
        throw new Error('Failed to generate background');
      }

      const { background } = await backgroundResponse.json();

      setCurrentStep('Merging punchline and background...');

      const mergeResponse = await fetch('/api/merge-punchline-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ punchline, background, uuid }),
      });

      if (!mergeResponse.ok) {
        throw new Error('Failed to merge punchline and background');
      }

      const { mergedImage } = await mergeResponse.json();

      setCurrentStep('Preparing NFT mint...');

      const metadataResponse = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mergedImage, humor, love, subtlety, length, uuid }),
      });

      if (!metadataResponse.ok) {
        throw new Error('Failed to prepare NFT metadata');
      }

      const { nftUri } = await metadataResponse.json();

      const mintArgs = {
        nftUri: stringToHex(nftUri),
      };

      const hermesCollection = new HermesCollectionNFTInstance(collectionId);

      if (!wallet?.signer) {
        throw new Error("Signer is undefined. Please ensure the wallet is connected.");
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await hermesCollection.transact.mint({
        signer: wallet.signer,
        args: mintArgs,
        attoAlphAmount: ONE_ALPH,
      });

      if (result.txId) {
        setCurrentStep('Waiting for transaction confirmation...');

        const nodeProvider = wallet.signer!.nodeProvider!;
        const txId = result.txId;

        let txStatus;
        let confirmations = 0;
        do {
          await new Promise((resolve) => setTimeout(resolve, 5000));

          txStatus = await nodeProvider.transactions.getTransactionsStatus({ txId });

          if (txStatus.type === 'Confirmed') {
            const confirmedStatus = txStatus as { chainConfirmations: number };
            confirmations = confirmedStatus.chainConfirmations;

            if (confirmations >= 2) {
              setMintedNFT(mergedImage);
              setCurrentStep('NFT successfully minted and transaction confirmed!');
              break;
            } else {
              setCurrentStep(`Transaction confirmed with ${confirmations} confirmations. Waiting for more...`);
            }
          } else if (txStatus.type === 'TxNotFound') {
            alert("Transaction not found. Please try again.");
            break;
          }
        } while (txStatus.type === 'MemPooled' || confirmations < 2);

      } else {
        throw new Error('Transaction failed: No txId returned.');
      }

    } catch (error) {
      setCurrentStep(`Error during minting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <MintedNFTDisplay
          nftImageUrl={mintedNFT}
          isLoading={isGenerating}
          currentStep={currentStep}
        />

        <ControlPanel
          humor={humor}
          love={love}
          subtlety={subtlety}
          length={length}
          onHumorChange={setHumor}
          onLoveChange={setLove}
          onSubtletyChange={setSubtlety}
          onLengthChange={setLength}
          onGenerateClick={handleGenerateAndMint}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default PunchlineBackgroundGenerator;