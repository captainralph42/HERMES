import { Deployer, DeployFunction, Network } from '@alephium/cli';
import { Settings } from '../alephium.config';
import { HermesNFT } from '../artifacts/ts';

const deployHermesNFT: DeployFunction<Settings> = async (deployer: Deployer, network: Network<Settings>): Promise<void> => {
  // Étape 1 : Déployer le contrat template HermesNFT
  const hermesNFTTemplateResult = await deployer.deployContract(HermesNFT, {
    initialFields: {
      collectionId: '',
      nftIndex: 0n,
      uri: ''
    }
  });
  
  console.log(`HermesNFT template contract déployé avec succès à l'adresse : ${hermesNFTTemplateResult.contractInstance.address}`);
  console.log(`HermesNFT contract id : ${hermesNFTTemplateResult.contractInstance.contractId}`);
};

export default deployHermesNFT;
