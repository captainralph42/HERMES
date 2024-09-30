import { getPrices } from './oracle';

export const fetchPrices = async (): Promise<{ alphPrice: number | null, btcPrice: number | null }> => {
  try {
    const { alphPrice, btcPrice } = await getPrices();
    return { alphPrice, btcPrice };
  } catch (error) {
    console.error("Error fetching prices:", error);
    return { alphPrice: null, btcPrice: null };
  }
};
