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

  const collectionId = '24MqNmyr4hQoHx8gWpz6Z9TNGYDvJNBbUprkjuziBkTKD';

  useEffect(() => {
    setUuid(uuidv4()); 
  }, [isGenerating]);

  const handleGenerateAndMint = async () => {
    setIsGenerating(true);
    setCurrentStep('Generating punchline...');
    console.log("=== Starting mint process ===");

    try {
      console.log("UUID generated:", uuid);

      if (!wallet?.signer) {
        console.error('Wallet not connected');
        alert('Wallet not connected. Please connect your wallet.');
        setIsGenerating(false);
        return;
      }

      console.log('Wallet connected with signer:', wallet.signer);

      console.log("Calling /api/generate-punchline with:", { humor, love, subtlety, length, uuid });
      const punchlineResponse = await fetch('/api/generate-punchline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humor, love, subtlety, length, uuid }),
      });

      console.log('Punchline response status:', punchlineResponse.status);

      if (!punchlineResponse.ok) {
        throw new Error('Failed to generate punchline');
      }

      const { punchline } = await punchlineResponse.json();
      console.log('Generated punchline:', punchline);

      setCurrentStep('Generating background...');
      console.log("Calling /api/generate-background with UUID:", uuid);

      const backgroundResponse = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid }),
      });

      console.log('Background response status:', backgroundResponse.status);

      if (!backgroundResponse.ok) {
        throw new Error('Failed to generate background');
      }

      const { background } = await backgroundResponse.json();
      console.log('Generated background:', background);

      setCurrentStep('Merging punchline and background...');
      console.log("Calling /api/merge-punchline-background with punchline and background");

      const mergeResponse = await fetch('/api/merge-punchline-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ punchline, background, uuid }),
      });

      console.log('Merge response status:', mergeResponse.status);

      if (!mergeResponse.ok) {
        throw new Error('Failed to merge punchline and background');
      }

      const { mergedImage } = await mergeResponse.json();
      console.log('Merged image: ok');

      setCurrentStep('Preparing NFT mint...');
      console.log("Calling /api/mint-nft with merged image and attributes");

      const metadataResponse = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mergedImage, humor, love, subtlety, length, uuid }),
      });

      console.log('Metadata response status:', metadataResponse.status);

      if (!metadataResponse.ok) {
        throw new Error('Failed to prepare NFT metadata');
      }

      const { nftUri } = await metadataResponse.json();
      console.log('NFT URI:', nftUri);

      if (!nftUri) {
        throw new Error('NFT URI is undefined');
      }

      console.log('Preparing mint transaction with nftUri:', nftUri);
      console.log('NFT URI before conversion to hex:', nftUri);

      const mintArgs = {
        nftUri: stringToHex(nftUri),
      };

      console.log('Mint args (after hex conversion):', mintArgs);

      const hermesCollection = new HermesCollectionNFTInstance(collectionId);
      console.log('Hermes Collection Instance:', {
        address: hermesCollection.address,
        contractId: hermesCollection.contractId,
        groupIndex: hermesCollection.groupIndex,
        methods: Object.keys(hermesCollection.transact),
      });

      if (!wallet?.signer) {
        console.error("Signer is undefined or wallet is not connected properly.");
        throw new Error("Signer is undefined. Please ensure the wallet is connected.");
      } else {
        console.log('Wallet signer:', wallet.signer);
      }

      console.log("Attempting to mint the NFT with the following parameters:", {
        signer: wallet.signer,
        args: mintArgs,
        attoAlphAmount: ONE_ALPH,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await hermesCollection.transact.mint({
        signer: wallet.signer,
        args: mintArgs,
        attoAlphAmount: ONE_ALPH,
      });

      if (result.txId) {
        console.log('Minting successful, txId:', result.txId);
        setCurrentStep('Waiting for transaction confirmation...');
        console.log('Transaction successful, in mempool:', result.txId);

        const nodeProvider = wallet.signer!.nodeProvider!;
        const txId = result.txId;

        let txStatus;
        let confirmations = 0;
        do {
          await new Promise((resolve) => setTimeout(resolve, 5000));

          txStatus = await nodeProvider.transactions.getTransactionsStatus({ txId });
          console.log('Transaction status:', txStatus.type);

          if (txStatus.type === 'Confirmed') {
            const confirmedStatus = txStatus as { chainConfirmations: number };
            confirmations = confirmedStatus.chainConfirmations;

            console.log(`Transaction confirmed with ${confirmations} confirmations.`);

            if (confirmations >= 2) {
              setMintedNFT(mergedImage);
              setCurrentStep('NFT successfully minted and transaction confirmed!');
              break;
            } else {
              setCurrentStep(`Transaction confirmed with ${confirmations} confirmations. Waiting for more...`);
            }
          } else if (txStatus.type === 'TxNotFound') {
            console.error("Transaction not found.");
            alert("Transaction not found. Please try again.");
            break;
          }
        } while (txStatus.type === 'MemPooled' || confirmations < 2);

      } else {
        console.error('Transaction failed: No txId returned.');
        throw new Error('Transaction failed: No txId returned.');
      }

    } catch (error) {
      console.error('Error during minting process:', error);
      setCurrentStep(`Error during minting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      console.log("=== Mint process finished ===");
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
