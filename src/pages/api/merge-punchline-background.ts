import type { NextApiRequest, NextApiResponse } from 'next';
import { mergePunchlineAndBackground } from '../../services/nft/mergerService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { punchline, background } = req.body;

    try {
      console.log("Received punchline and background for merging:", { punchline, background });

      // Appelle la nouvelle fonction de fusion (backend)
      const mergedImage = await mergePunchlineAndBackground(punchline, background);
      console.log("Merged image successfully");

      // Envoyer l'image fusionnée au client
      res.status(200).json({ mergedImage });
    } catch (error) {
      console.error("Erreur lors de la fusion de la punchline et du background:", error);
      res.status(500).json({ error: 'Erreur lors de la fusion de la punchline et du background.' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
