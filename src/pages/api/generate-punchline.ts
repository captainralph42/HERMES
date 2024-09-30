import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePunchline } from '../../services/generation/textService';
import { fetchPrices } from '../../services/oracle/priceService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { humor, love, subtlety, length } = req.body;

    try {
      // Log des inputs reçus
      console.log("Received request with parameters:", { humor, love, subtlety, length });

      // Fetch des prix ALPH et BTC
      const { alphPrice, btcPrice } = await fetchPrices();
      console.log("Fetched prices:", { alphPrice, btcPrice });

      // Génération de la punchline
      const punchline = await generatePunchline(humor, love, subtlety, length, alphPrice ?? 1.5, btcPrice ?? 30000);
      console.log("Generated punchline:", punchline);

      // Envoi de la punchline générée au client
      res.status(200).json({ punchline });
    } catch (error) {
      console.error("Erreur lors de la génération de la punchline:", error);
      res.status(500).json({ error: 'Erreur lors de la génération de la punchline' });
    }
  } else {
    console.warn("Méthode non autorisée:", req.method);
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
