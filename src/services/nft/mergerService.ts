import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

const fontPath = path.join(process.cwd(), 'src/fonts/Holyfat.ttf');

if (!fs.existsSync(fontPath)) {
  console.error('Erreur: Le fichier de police n\'existe pas:', fontPath);
  process.exit(1);
}

registerFont(fontPath, { family: 'HolyfatCustom' });

const loadImageFromUrl = async (url: string): Promise<any> => {
  try {
    const image = await loadImage(url);
    return image;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors du chargement de l'image: ${error.message}`);
    } else {
      throw new Error('Erreur inconnue lors du chargement de l\'image');
    }
  }
};

export const mergePunchlineAndBackground = async (punchline: string, backgroundUrl: string): Promise<string> => {
  try {
    const backgroundImage = await loadImageFromUrl(backgroundUrl);

    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    ctx.drawImage(backgroundImage, 0, 0, 1080, 1080);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px HolyfatCustom';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
      const words = text.split(' ');
      let lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const maxWidth = 1000;
    const lines = wrapText(ctx, punchline, maxWidth);
    const lineHeight = 80;
    const textX = canvas.width / 2;
    const textY = canvas.height / 2 - (lines.length * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, textX, textY + index * lineHeight);
    });

    const logoUrl = '/images/hermes_alephium_logo.png';
    const watermark = await loadImage(`http://localhost:3000${logoUrl}`);

    const watermarkWidth = canvas.width * 0.15;
    const aspectRatio = watermark.height / watermark.width;
    const watermarkHeight = watermarkWidth * aspectRatio;

    const watermarkX = 30;
    const watermarkY = 30;

    ctx.drawImage(watermark as unknown as CanvasImageSource, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Erreur lors de la fusion de la punchline et du background:', error);
    throw error;
  }
};
