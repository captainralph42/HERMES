import type { NextApiRequest, NextApiResponse } from 'next';
import { generateBackgroundImage } from '../../services/generation/imageService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log("Received request to generate background");

      // Appelle le service pour générer le background
      const background = await generateBackgroundImage();
      console.log("Generated background:", background);

      // Envoyer le background généré au client
      res.status(200).json({ background });
    } catch (error) {
      console.error("Erreur lors de la génération du background:", error);
      res.status(500).json({ error: 'Erreur lors de la génération du background.' });
    }
  } else {
    console.warn("Méthode non autorisée:", req.method);
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
