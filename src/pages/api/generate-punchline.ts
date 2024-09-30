import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePunchline } from '../../services/generation/textService';
import { fetchPrices } from '../../services/oracle/priceService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { humor, love, subtlety, length } = req.body;

    try {
      console.log("Received request with parameters:", { humor, love, subtlety, length });

      const { alphPrice, btcPrice } = await fetchPrices();
      console.log("Fetched prices:", { alphPrice, btcPrice });

      const punchline = await generatePunchline(humor, love, subtlety, length, alphPrice ?? 1.5, btcPrice ?? 30000);
      console.log("Generated punchline:", punchline);

      res.status(200).json({ punchline });
    } catch (error) {
      console.error("Error generating punchline:", error);
      res.status(500).json({ error: 'Error generating punchline' });
    }
  } else {
    console.warn("Method not allowed:", req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
