import { NextApiRequest, NextApiResponse } from 'next';
import { HermesCollectionNFTInstance } from 'artifacts/ts'; // Import de l'instance de ta collection NFT
import { ONE_ALPH, stringToHex } from '@alephium/web3'; // Utilisation des utilitaires Alephium pour les transactions

// Handler API pour gérer le minting
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Récupérer les données envoyées par le frontend
    const { signature, nftUri, walletAddress } = req.body;

    // Valider les données reçues
    if (!signature || !nftUri || !walletAddress) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Préparation des arguments de minting
    const mintArgs = {
      nftUri: stringToHex(nftUri), // Convertir l'URI du NFT en hexadécimal
      attoAlphAmount: ONE_ALPH,    // Montant des frais de transaction (1 ALPH ici)
    };

    // ID de la collection où le NFT va être minté
    const collectionId = '24MqNmyr4hQoHx8gWpz6Z9TNGYDvJNBbUprkjuziBkTKD'; // Utiliser ton propre Collection ID
    const hermesCollection = new HermesCollectionNFTInstance(collectionId);

    // Exécution de la transaction sur la blockchain Alephium
    const result = await hermesCollection.transact.mint({
      signer: walletAddress,       // Adresse du wallet de l'utilisateur
      args: mintArgs,              // Arguments préparés pour la transaction
      attoAlphAmount: ONE_ALPH,    // Frais de transaction
    });

    // Vérification si la transaction a un txId (transaction ID)
    if (result.txId) {
      return res.status(200).json({ message: 'NFT successfully minted', txId: result.txId });
    } else {
      throw new Error('Transaction failed: No txId returned');
    }
    } catch (error) {
        console.error('Error during minting transaction:', error);
        
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Error during transaction', error: error.message });
        } else {
            return res.status(500).json({ message: 'Unknown error occurred' });
        }
    }

}
