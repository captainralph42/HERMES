import { Deployer, DeployFunction, Network } from '@alephium/cli';
import { Settings } from '../alephium.config';
import { HermesCollectionNFT } from '../artifacts/ts';  // Importe le contrat HermesCollectionNFT
import { stringToHex } from '@alephium/web3';

const deployHermesCollection: DeployFunction<Settings> = async (deployer: Deployer, network: Network<Settings>): Promise<void> => {
  // Assure-toi de renseigner l'ID du contrat HermesNFT déployé
  const hermesNFTTemplateId = 'bf330633598720a7824ccc3011b355e441e650933c908fc430260e8336005600';  // Remplace par le contractId d'HermesNFT

  // Étape 2 : Déployer le contrat de collection HermesCollectionNFT
  const hermesCollectionResult = await deployer.deployContract(HermesCollectionNFT, {
    initialFields: {
      nftTemplateId: hermesNFTTemplateId,  // Utilise l'ID du contrat template HermesNFT
      collectionUri: stringToHex('https://ipfs.io/ipfs/Qmdg6iNYHfCitpT9B3ob6YGmUyASXWFUXszQ7ZM8YwjZL5'),     // URI IPFS de la collection en hexadécimal
      totalSupply: 0n                      // Initialement, aucun NFT minté
    }
  });

  console.log(`HermesCollectionNFT contract déployé avec succès à l'adresse : ${hermesCollectionResult.contractInstance.address}`);
  console.log(`HermesCollectionNFT contract id : ${hermesCollectionResult.contractInstance.contractId}`);
};

export default deployHermesCollection;
