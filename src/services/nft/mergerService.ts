import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

const fontPath = path.join(process.cwd(), 'src/fonts/Holyfat.ttf');

if (!fs.existsSync(fontPath)) {
  console.error('Error: Font file does not exist:', fontPath);
  process.exit(1);
}

registerFont(fontPath, { family: 'HolyfatCustom' });

const loadImageFromUrl = async (url: string): Promise<any> => {
  try {
    const image = await loadImage(url);
    return image;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading image: ${error.message}`);
    } else {
      throw new Error('Unknown error loading image');
    }
  }
};

export const mergePunchlineAndBackground = async (
  punchline: string,
  backgroundUrl: string,
  watermarkUrl: string
): Promise<string> => {
  try {
    console.log("Starting to merge punchline and background");
    console.log("Punchline:", punchline);
    console.log("Background URL:", backgroundUrl);
    console.log("Watermark URL:", watermarkUrl);

    const backgroundImage = await loadImageFromUrl(backgroundUrl);
    console.log("Background image loaded");

    const watermark = await loadImageFromUrl(watermarkUrl);
    console.log("Watermark image loaded");

    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    ctx.drawImage(backgroundImage, 0, 0, 512, 512);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px HolyfatCustom';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines: string[] = [];
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

    const watermarkWidth = canvas.width * 0.15;
    const aspectRatio = watermark.height / watermark.width;
    const watermarkHeight = watermarkWidth * aspectRatio;

    const watermarkX = 30;
    const watermarkY = 30;

    ctx.drawImage(watermark as unknown as CanvasImageSource, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

    console.log("Image merged successfully");

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error merging punchline and background:', error);
    throw error;
  }
};

