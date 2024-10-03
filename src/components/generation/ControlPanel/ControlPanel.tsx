import React from 'react';
import SliderInput from '../../common/SliderInput/SliderInput';
import GenerateButton from '../../common/Button/GenerateButton';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  sliders: {
    humor: number;
    love: number;
    subtlety: number;
    length: number;
  };
  onSliderChange: (name: string, value: number) => void;
  onGenerateClick: () => void;
  isAwaitingConfirmation: boolean;
  isGenerating: boolean;
  isLoading: boolean;
  buttonText: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  sliders,
  onSliderChange,
  onGenerateClick,
  isAwaitingConfirmation,
  isGenerating,
  isLoading,
  buttonText,
}) => {
  return (
    <div className={styles.controlPanel}>
      <SliderInput label="Humor" value={sliders.humor} onChange={(value) => onSliderChange('humor', value)} />
      <SliderInput label="Love" value={sliders.love} onChange={(value) => onSliderChange('love', value)} />
      <SliderInput label="Subtlety" value={sliders.subtlety} onChange={(value) => onSliderChange('subtlety', value)} />
      <SliderInput label="Length" value={sliders.length} onChange={(value) => onSliderChange('length', value)} />
      <div className={styles.buttonContainer}>
        <GenerateButton
          onClick={onGenerateClick}
          isLoading={isLoading}
          isGenerating={isGenerating}
          buttonText={isAwaitingConfirmation ? 'Confirm' : buttonText}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
