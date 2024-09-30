import React from 'react';
import SliderInput from '../../common/SliderInput/SliderInput';
import GenerateButton from '../../common/Button/GenerateButton';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  humor: number;
  love: number;
  subtlety: number;
  length: number;
  onHumorChange: (value: number) => void;
  onLoveChange: (value: number) => void;
  onSubtletyChange: (value: number) => void;
  onLengthChange: (value: number) => void;
  onGenerateClick: () => void;
  isGenerating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  humor,
  love,
  subtlety,
  length,
  onHumorChange,
  onLoveChange,
  onSubtletyChange,
  onLengthChange,
  onGenerateClick,
  isGenerating,
}) => {
  return (
    <div className={styles.controlPanel}>
      <SliderInput label="Humor" value={humor} onChange={onHumorChange} />
      <SliderInput label="Love" value={love} onChange={onLoveChange} />
      <SliderInput label="Subtlety" value={subtlety} onChange={onSubtletyChange} />
      <SliderInput label="Length" value={length} onChange={onLengthChange} />
      <div className={styles.buttonContainer}>
        <GenerateButton onClick={onGenerateClick} isLoading={isGenerating} />
      </div>
    </div>
  );
};

export default ControlPanel;
