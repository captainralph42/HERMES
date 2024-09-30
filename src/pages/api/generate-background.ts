import type { NextApiRequest, NextApiResponse } from 'next';
import { generateBackgroundImage } from '../../services/generation/imageService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log("Received request to generate background");

      const background = await generateBackgroundImage();
      console.log("Generated background:", background);

      res.status(200).json({ background });
    } catch (error) {
      console.error("Error generating background:", error);
      res.status(500).json({ error: 'Error generating background.' });
    }
  } else {
    console.warn("Method not allowed:", req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
