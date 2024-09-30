import React from 'react';

interface ImageResultProps {
  imageUrl: string | null;
}

const ImageResult: React.FC<ImageResultProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div>
      <h2>Image finale :</h2>
      <img src={imageUrl} alt="Final Punchline and Background" />
      <a href={imageUrl} download="punchline_background.png">
        Télécharger l'image
      </a>
    </div>
  );
};

export default ImageResult;
