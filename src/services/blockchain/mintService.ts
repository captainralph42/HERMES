//TR

import { HermesCollectionNFTInstance } from 'artifacts/ts'; // Assure-toi que ce chemin est correct
import { ONE_ALPH, stringToHex } from '@alephium/web3';

export const prepareMintNFT = (nftUri: string) => {
  try {
    const collectionId = '24MqNmyr4hQoHx8gWpz6Z9TNGYDvJNBbUprkjuziBkTKD'; // Ton collectionId

    // Arguments nécessaires pour le mint
    const mintArgs = {
      nftUri: stringToHex(nftUri), // Convertir l'URI en hexadécimal pour Alephium
      attoAlphAmount: ONE_ALPH,    // Montant du mint en ALPH
    };

    console.log('Mint Args:', mintArgs);
    return mintArgs; // On retourne simplement les arguments à utiliser pour la transaction côté frontend
  } catch (error) {
    console.error('Erreur lors de la préparation du mint:', error);
    throw error;
  }
};
