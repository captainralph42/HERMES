import { Deployer, DeployFunction, Network } from '@alephium/cli';
import { Settings } from '../alephium.config';
import { HermesCollectionNFT } from '../artifacts/ts';
import { stringToHex } from '@alephium/web3';

const deployHermesCollection: DeployFunction<Settings> = async (deployer: Deployer, network: Network<Settings>): Promise<void> => {

  const hermesNFTTemplateId = 'bf330633598720a7824ccc3011b355e441e650933c908fc430260e8336005600';


  const hermesCollectionResult = await deployer.deployContract(HermesCollectionNFT, {
    initialFields: {
      nftTemplateId: hermesNFTTemplateId,
      collectionUri: stringToHex('https://ipfs.io/ipfs/Qmdg6iNYHfCitpT9B3ob6YGmUyASXWFUXszQ7ZM8YwjZL5'),
      totalSupply: 0n
    }
  });

  console.log(`HermesCollectionNFT contract déployé avec succès à l'adresse : ${hermesCollectionResult.contractInstance.address}`);
  console.log(`HermesCollectionNFT contract id : ${hermesCollectionResult.contractInstance.contractId}`);
};

export default deployHermesCollection;
