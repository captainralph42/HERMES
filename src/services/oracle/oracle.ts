import { PriceFetcherInstance } from "artifacts/ts";
import { web3, NodeProvider } from '@alephium/web3';

const nodeProvider = new NodeProvider('https://node.testnet.alephium.org');
web3.setCurrentNodeProvider(nodeProvider);

export async function getPrices(): Promise<{ alphPrice: number | null, btcPrice: number | null }> {
  const oracleAddress = process.env.NEXT_PUBLIC_ORACLE_ADDRESS || '';  // Récupérer depuis .env

  const priceFetcher = new PriceFetcherInstance(oracleAddress);

  try {
    const result = await priceFetcher.view.update();

    console.log('Raw result from contract call:', result);

    const rawAlphPrice = result.contracts[0].fields.alphPrice;
    const rawBtcPrice = result.contracts[0].fields.btcPrice;

    const alphPrice = typeof rawAlphPrice === 'bigint' ? Number(rawAlphPrice) / 10 ** 8 : null;
    const btcPrice = typeof rawBtcPrice === 'bigint' ? Number(rawBtcPrice) / 10 ** 8 : null;

    return {
      alphPrice: alphPrice ? parseFloat(alphPrice.toFixed(2)) : null,
      btcPrice: btcPrice ? parseFloat(btcPrice.toFixed(2)) : null
    };
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw new Error('Unable to fetch $ALPH and BTC prices');
  }
}
