const pinataApiKey = process.env.PINATA_API_KEY!;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY!;

export const uploadImageToPinata = async (file: File) => {
  const data = new FormData();
  data.append('file', file);

  console.log('File to upload to Pinata:', file);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecretApiKey,
    },
    body: data,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Pinata image upload failed: ${errorMessage}`);
  }

  const result = await response.json();
  return result.IpfsHash;
};

export const uploadJsonToPinata = async (metadata: object) => {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecretApiKey,
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Pinata JSON upload failed: ${errorMessage}`);
  }

  const result = await response.json();
  return result.IpfsHash;
};
