import { Deployer, DeployFunction, Network } from '@alephium/cli';
import { Settings } from '../alephium.config';
import { HermesNFT } from '../artifacts/ts';  // Importe le contrat HermesNFT

const deployHermesNFT: DeployFunction<Settings> = async (deployer: Deployer, network: Network<Settings>): Promise<void> => {
  // Étape 1 : Déployer le contrat template HermesNFT
  const hermesNFTTemplateResult = await deployer.deployContract(HermesNFT, {
    initialFields: {
      collectionId: '',  // À remplir lors du minting par le contrat de collection
      nftIndex: 0n,      // Index initial
      uri: ''            // L'URI des métadonnées sera défini lors du mint
    }
  });
  
  console.log(`HermesNFT template contract déployé avec succès à l'adresse : ${hermesNFTTemplateResult.contractInstance.address}`);
  console.log(`HermesNFT contract id : ${hermesNFTTemplateResult.contractInstance.contractId}`);
};

export default deployHermesNFT;
