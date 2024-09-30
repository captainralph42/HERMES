import { createCanvas, loadImage } from 'canvas';

export const mergePunchlineAndBackground = async (punchline: string, backgroundUrl: string): Promise<string> => {
  try {
    // Créer un canvas de 1080x1080
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    // Charger l'image de fond depuis une URL externe
    const backgroundImage = await loadImage(backgroundUrl);
    ctx.drawImage(backgroundImage, 0, 0, 1080, 1080); // Dessiner l'image de fond

    // Appliquer les styles de texte pour la punchline
    ctx.font = 'bold 50px HolyFat, sans-serif'; // Utiliser ta police ici
    ctx.fillStyle = '#ffffff'; // Couleur du texte
    ctx.textAlign = 'center'; // Centrer le texte
    ctx.fillText(punchline, 540, 540); // Dessiner la punchline au centre du canvas

    // Retourner l'image fusionnée sous forme de base64
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Erreur lors de la fusion de la punchline et du background:', (error as Error).message);
    throw error;
  }
};
