// src/services/priceService.ts
import { getPrices } from './oracle';

export const fetchPrices = async (): Promise<{ alphPrice: number | null, btcPrice: number | null }> => {
  try {
    const { alphPrice, btcPrice } = await getPrices();
    return { alphPrice, btcPrice };
  } catch (error) {
    console.error("Erreur lors de la récupération des prix:", error);
    return { alphPrice: null, btcPrice: null };
  }
};
