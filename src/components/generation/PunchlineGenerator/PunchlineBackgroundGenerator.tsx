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
  const [sliders, setSliders] = useState({
    humor: 50,
    love: 50,
    subtlety: 50,
    length: 50,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [uuid, setUuid] = useState<string>(uuidv4());
  const [isGenerated, setIsGenerated] = useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [nftUri, setNftUri] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID || '';

  useEffect(() => {
    if (isGenerating) {
      setUuid(uuidv4());
    }
  }, [isGenerating]);

  const fetchData = async (url: string, body: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.json();
  };

  const handleGenerateNFT = async () => {
    setIsGenerating(true);
    setIsGenerated(false);
    setIsAwaitingConfirmation(false);
    setMintedNFT(null);

    try {
      if (!wallet?.signer) {
        alert('Wallet not connected. Please connect your wallet.');
        setIsGenerating(false);
        return;
      }

      const { humor, love, subtlety, length } = sliders;

      setCurrentStep('Generating punchline...');
      const { punchline } = await fetchData('/api/generate-punchline', { humor, love, subtlety, length, uuid });

      setCurrentStep('Generating background...');
      const { background } = await fetchData('/api/generate-background', { uuid });

      setCurrentStep('Merging punchline and background...');
      const { mergedImage } = await fetchData('/api/merge-punchline-background', { punchline, background, uuid });
      setMergedImage(mergedImage);

      setCurrentStep('Preparing NFT metadata...');
      const { nftUri } = await fetchData('/api/mint-nft', { mergedImage, humor, love, subtlety, length, uuid });
      setNftUri(nftUri);

      setIsGenerated(true);
      setCurrentStep('NFT ready to mint! Click confirm to finalize.');
      setIsAwaitingConfirmation(true);
    } catch (error) {
      setCurrentStep(`Error during generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmTransaction = async () => {
    setCurrentStep('Waiting for the confirmation...');
    setIsMinting(true);

    try {
      if (!wallet?.signer) {
        throw new Error("Signer is undefined. Please ensure the wallet is connected.");
      }

      const mintArgs = {
        nftUri: stringToHex(nftUri!),
      };

      const hermesCollection = new HermesCollectionNFTInstance(collectionId);

      const result = await hermesCollection.transact.mint({
        signer: wallet.signer,
        args: mintArgs,
        attoAlphAmount: ONE_ALPH,
      });

      if (result.txId) {
        const txId = result.txId;
        let confirmations = 0;
        let txStatus;

        do {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          txStatus = await wallet.signer!.nodeProvider!.transactions.getTransactionsStatus({ txId });

          if (txStatus.type === 'Confirmed') {
            confirmations = (txStatus as { chainConfirmations: number }).chainConfirmations;
            if (confirmations >= 2) {
              setMintedNFT(mergedImage);
              setCurrentStep('');

              setIsGenerated(false);
              setMergedImage(null);
              setNftUri(null);
              setIsAwaitingConfirmation(false);
              setIsMinting(false);
              break;
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
      setIsAwaitingConfirmation(false);
      setIsGenerating(false);
      setIsMinting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <MintedNFTDisplay
          nftImageUrl={mintedNFT}
          currentStep={currentStep}
        />

        <ControlPanel
          sliders={sliders}
          onSliderChange={(name, value) => setSliders((prev) => ({ ...prev, [name]: value }))}
          onGenerateClick={isGenerated ? handleConfirmTransaction : handleGenerateNFT}
          isAwaitingConfirmation={isAwaitingConfirmation}
          isGenerating={isGenerating}
          isLoading={isGenerating || isMinting}
          buttonText={isMinting ? 'Minting...' : isGenerated ? 'Confirm' : 'Mint'}
        />
      </div>
    </div>
  );
};

export default PunchlineBackgroundGenerator;
