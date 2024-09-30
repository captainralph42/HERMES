import React from 'react';
import styles from './SliderInput.module.css';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange }) => {
  return (
    <div className={styles.sliderContainer}>
      <label className={styles.sliderLabel}> {/* Applique la classe pour centrer */}
        {label}
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.sliderInput}
      />
    </div>
  );
};

export default SliderInput;
