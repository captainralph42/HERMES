import React, { useState, useEffect } from 'react';
import MintedNFTDisplay from '../../nft/MintedNFTDisplay/MintedNFTDisplay';
import ControlPanel from '../ControlPanel/ControlPanel';
import { useWallet } from '@alephium/web3-react'; 
import { HermesCollectionNFTInstance } from 'artifacts/ts';
import { ONE_ALPH, stringToHex } from '@alephium/web3'; 
import { v4 as uuidv4 } from 'uuid'; // UUID importé pour générer des identifiants uniques
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
  const [uuid, setUuid] = useState<string>(''); // Ajout de l'UUID pour suivre chaque session utilisateur

  const collectionId = '24MqNmyr4hQoHx8gWpz6Z9TNGYDvJNBbUprkjuziBkTKD'; // Ton collectionId

  // Génère un UUID à chaque nouvelle tentative de mint
  useEffect(() => {
    setUuid(uuidv4()); // Génère un UUID unique pour chaque nouvelle session
  }, [isGenerating]);

  const handleGenerateAndMint = async () => {
    setIsGenerating(true);
    setCurrentStep('Generating punchline...');
  
    try {
      // Vérifier que le wallet est connecté
      if (!wallet?.signer) {
        alert('Wallet not connected. Please connect your wallet.');
        setIsGenerating(false);
        return;
      }
  
      // Appeler l'API pour générer la punchline (succession)
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
  
      // Appeler l'API pour générer le background (succession)
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
  
      // Appeler l'API pour fusionner punchline et background
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
  
      // Appeler l'API pour préparer les métadonnées du NFT
      const metadataResponse = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mergedImage, humor, love, subtlety, length, uuid }),
      });
  
      if (!metadataResponse.ok) {
        throw new Error('Failed to prepare NFT metadata');
      }
  
      const { nftUri } = await metadataResponse.json();
  
      // Vérifie que `nftUri` est bien défini avant de l'utiliser
      if (!nftUri) {
        throw new Error('NFT URI is undefined');
      }
  
      // Maintenant, signer et mint côté frontend
      const mintArgs = {
        nftUri: stringToHex(nftUri), // Convertir l'URI en hexadécimal pour Alephium
        attoAlphAmount: ONE_ALPH,    // Frais de transaction
      };
  
      const hermesCollection = new HermesCollectionNFTInstance(collectionId);
      const result = await hermesCollection.transact.mint({
        signer: wallet.signer,       // Le signer du wallet connecté
        args: mintArgs,              // Les arguments préparés pour la transaction
        attoAlphAmount: ONE_ALPH,    // Frais de transaction
      });
  
      if (result.txId) {
        setCurrentStep('NFT successfully minted!');
        setMintedNFT(mergedImage); // Affiche l'image finale du NFT minté
      } else {
        throw new Error('Transaction failed: No txId returned.');
      }
    } catch (error) {
      console.error('Error during minting process:', error);
  
      // Vérifier si l'erreur est une instance d'Error
      if (error instanceof Error) {
        setCurrentStep(`Error during minting: ${error.message}`);
      } else {
        setCurrentStep('Unknown error during minting.');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Affiche le NFT minté ou le statut du mint */}
        <MintedNFTDisplay
          nftImageUrl={mintedNFT}
          isLoading={isGenerating}
          currentStep={currentStep}
        />

        {/* Panneau de contrôle pour les sliders */}
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
