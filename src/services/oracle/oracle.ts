import { PriceFetcherInstance } from "artifacts/ts";
import { web3, NodeProvider } from '@alephium/web3';

// Initialiser un node provider avec l'URL de ton noeud Alephium
const nodeProvider = new NodeProvider('https://node.testnet.alephium.org'); // Remplace par l'URL correcte de ton noeud (mainnet ou testnet)
web3.setCurrentNodeProvider(nodeProvider);

// Fonction pour récupérer les prix de $ALPH et BTC en une seule fois
export async function getPrices(): Promise<{ alphPrice: number | null, btcPrice: number | null }> {
  const oracleAddress = "ut6SYNw675FBDinJNcywaJUw4ooufkeofoBDxNAN149M"; // Adresse de l'oracle

  // Créer une instance de PriceFetcher
  const priceFetcher = new PriceFetcherInstance(oracleAddress);

  try {
    // Appel de la méthode 'update' pour obtenir les données actuelles du contrat
    const result = await priceFetcher.view.update();

    // Affiche la structure du résultat pour voir les retours
    console.log('Résultat brut de l\'appel au contrat :', result);

    // Récupérer les valeurs de alphPrice et btcPrice dans les fields
    const rawAlphPrice = result.contracts[0].fields.alphPrice;
    const rawBtcPrice = result.contracts[0].fields.btcPrice;

    // Convertir les prix avec des décimales en divisant directement par 10^8 sous forme de number
    const alphPrice = typeof rawAlphPrice === 'bigint' ? Number(rawAlphPrice) / 10 ** 8 : null;
    const btcPrice = typeof rawBtcPrice === 'bigint' ? Number(rawBtcPrice) / 10 ** 8 : null;

    return {
      alphPrice: alphPrice ? parseFloat(alphPrice.toFixed(2)) : null,
      btcPrice: btcPrice ? parseFloat(btcPrice.toFixed(2)) : null
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des prix :', error);
    throw new Error('Impossible de récupérer les prix de $ALPH et BTC');
  }
}
