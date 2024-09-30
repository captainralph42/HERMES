import type { NextApiRequest, NextApiResponse } from 'next';
import { mergePunchlineAndBackground } from '../../services/nft/mergerService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { punchline, background } = req.body;

    try {
      const mergedImage = await mergePunchlineAndBackground(punchline, background);
      res.status(200).json({ mergedImage });
    } catch (error) {
      console.error("Error merging punchline and background:", error);
      res.status(500).json({ error: 'Error merging punchline and background.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
