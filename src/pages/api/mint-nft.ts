export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Augmenter la limite à 10MB ou plus si nécessaire
    },
  },
};

import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadImageToPinata, uploadJsonToPinata } from '../../services/nft/pinataService';

// Verrouillage par utilisateur (UUID ou adresse de wallet)
const mintLocks: { [key: string]: boolean } = {}; // Clé = UUID ou adresse de wallet

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mergedImage, humor, love, subtlety, length, uuid } = req.body;

    try {
      // Validation des données de la requête
      if (!mergedImage || humor === undefined || love === undefined || subtlety === undefined || length === undefined || !uuid) {
        return res.status(400).json({ error: 'Données manquantes dans la requête.' });
      }

      // Vérifier si un minting est déjà en cours pour cet utilisateur (UUID ou adresse wallet)
      if (mintLocks[uuid]) {
        return res.status(429).json({ error: 'Minting déjà en cours pour cet utilisateur. Veuillez patienter.' });
      }

      // Verrouiller le minting pour cet utilisateur uniquement
      mintLocks[uuid] = true;

      // Convertir l'image base64 en fichier
      const imageFile = base64ToFile(mergedImage, 'nft-image.png');

      // Uploader l'image sur Pinata
      const imageIpfsHash = await uploadImageToPinata(imageFile);

      // Créer et uploader les métadonnées JSON sur Pinata
      const metadata = {
        name: "Hermes NFT",
        description: "Hackathon 1.5, why so serious?",
        image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
        attributes: [
          { trait_type: "Humor Level", value: humor },
          { trait_type: "Love Level", value: love },
          { trait_type: "Subtlety Level", value: subtlety },
          { trait_type: "Length", value: length }
        ]
      };
      const jsonIpfsHash = await uploadJsonToPinata(metadata);

      // URI du NFT
      const nftUri = `https://ipfs.io/ipfs/${jsonIpfsHash}`;

      // Déverrouiller le minting après réussite
      mintLocks[uuid] = false;

      // Envoyer l'URI du NFT au frontend
      res.status(200).json({ nftUri });
    } catch (error) {
      console.error("Erreur lors du minting:", error);
      const err = error as Error;

      // Déverrouiller en cas d'échec
      mintLocks[uuid] = false;

      res.status(500).json({ error: `Erreur lors du minting: ${err.message}` });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

// Fonction pour convertir une image base64 en fichier
const base64ToFile = (base64Data: string, filename: string) => {
  const [metaData, base64Content] = base64Data.split(',');
  const mime = metaData.match(/:(.*?);/)?.[1] || ''; // Extraction du type MIME
  const binary = atob(base64Content);
  const byteArray = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    byteArray[i] = binary.charCodeAt(i);
  }

  return new File([byteArray], filename, { type: mime });
};
