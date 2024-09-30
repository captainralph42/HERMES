import React, { useEffect, useState } from 'react';
import { useWallet } from '@alephium/web3-react'; // Importer useWallet
import styles from './GenerateButton.module.css';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading }) => {
  const { account } = useWallet(); // Utiliser useWallet pour obtenir l'état du compte
  const [isMounted, setIsMounted] = useState(false); // État pour vérifier si le composant est monté côté client

  // Définir l'état monté à true après le rendu côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isConnected = !!account; // Si account est défini, l'utilisateur est connecté

  return (
    <button
      onClick={onClick}
      disabled={isLoading || !isConnected} // Désactiver si en cours de mint ou si le wallet n'est pas connecté
      className={styles.generateButton}
    >
      {isLoading ? 'Minting...' : isMounted ? (isConnected ? 'Mint' : 'Connect Wallet to Mint') : 'Mint'}
      {/* Afficher 'Mint' par défaut avant que le composant soit monté côté client */}
    </button>
  );
};

export default GenerateButton;
