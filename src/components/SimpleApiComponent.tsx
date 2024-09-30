import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des UUID

const SimpleApiComponent: React.FC = () => {
  const [humor, setHumor] = useState(50);
  const [love, setLove] = useState(50);
  const [subtlety, setSubtlety] = useState(50);
  const [length, setLength] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [uuid, setUuid] = useState<string>(''); // UUID pour suivre la session

  // Génère un UUID à chaque nouvelle tentative
  useEffect(() => {
    setUuid(uuidv4());
  }, [isGenerating]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep('Generating punchline...');

    try {
      // Appel API pour générer la punchline
      const punchlineResponse = await fetch('/api/generate-punchline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humor, love, subtlety, length, uuid }),
      });

      if (!punchlineResponse.ok) {
        throw new Error('Failed to generate punchline');
      }

      const { punchline } = await punchlineResponse.json();
      setCurrentStep('Generating background...');

      // Appel API pour générer le background
      const backgroundResponse = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid }),
      });

      if (!backgroundResponse.ok) {
        throw new Error('Failed to generate background');
      }

      const { background } = await backgroundResponse.json();
      setCurrentStep('Merging punchline and background...');

      // Appel API pour fusionner punchline et background
      const mergeResponse = await fetch('/api/merge-punchline-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ punchline, background, uuid }),
      });

      if (!mergeResponse.ok) {
        throw new Error('Failed to merge punchline and background');
      }

      const { mergedImage } = await mergeResponse.json();
      setGeneratedImage(mergedImage);
      setCurrentStep('Generation complete');
    } catch (error) {
      console.error('Error during generation:', error);
      setCurrentStep(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h2>Punchline Background Generator</h2>
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>

      {currentStep && <p>{currentStep}</p>}

      {generatedImage && (
        <div>
          <h3>Generated Image:</h3>
          <img src={generatedImage} alt="Generated result" />
        </div>
      )}
    </div>
  );
};

export default SimpleApiComponent;
