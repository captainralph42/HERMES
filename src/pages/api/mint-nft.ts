export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadImageToPinata, uploadJsonToPinata } from '../../services/nft/pinataService';

const mintLocks: { [key: string]: boolean } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mergedImage, humor, love, subtlety, length, uuid } = req.body;

    try {
      if (!mergedImage || humor === undefined || love === undefined || subtlety === undefined || length === undefined || !uuid) {
        return res.status(400).json({ error: 'Missing data in request.' });
      }

      if (mintLocks[uuid]) {
        return res.status(429).json({ error: 'Minting already in progress for this user. Please wait.' });
      }

      mintLocks[uuid] = true;

      const imageFile = base64ToFile(mergedImage, 'nft-image.png');
      const imageIpfsHash = await uploadImageToPinata(imageFile);

      const metadata = {
        name: "Hermes NFT",
        description: "Hackathon 1.5, why so serious?",
        image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
        attributes: [
          { trait_type: "Humor Level", value: humor },
          { trait_type: "Love Level", value: love },
          { trait_type: "Subtlety Level", value: subtlety },
          { trait_type: "Length", value: length }
        ]
      };

      const jsonIpfsHash = await uploadJsonToPinata(metadata);
      const nftUri = `https://ipfs.io/ipfs/${jsonIpfsHash}`;

      mintLocks[uuid] = false;

      res.status(200).json({ nftUri });
    } catch (error) {
      console.error("Error during minting:", error);
      const err = error as Error;

      mintLocks[uuid] = false;

      res.status(500).json({ error: `Error during minting: ${err.message}` });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

const base64ToFile = (base64Data: string, filename: string) => {
  const [metaData, base64Content] = base64Data.split(',');
  const mime = metaData.match(/:(.*?);/)?.[1] || '';
  const binary = atob(base64Content);
  const byteArray = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    byteArray[i] = binary.charCodeAt(i);
  }

  return new File([byteArray], filename, { type: mime });
};
