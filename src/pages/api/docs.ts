import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'src/content/docsContent.md');
  const content = fs.readFileSync(filePath, 'utf8');
  res.status(200).json({ content });
}
