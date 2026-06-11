import React from 'react';
import '../styles/CropSelector.css';

const crops = [
  { id: 'Rice', icon: '🌾' },
  { id: 'Wheat', icon: '🌾' },
  { id: 'Cotton', icon: '☁️' },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const CropSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="crop-selector-wrapper">
      <div className="crop-scroll-container">
        {crops.map((crop) => (
          <button
            key={crop.id}
            className={`crop-item ${selected === crop.id ? 'active' : ''}`}
            onClick={() => onSelect(crop.id)}
          >
            <span className="crop-icon">{crop.icon}</span>
            <span className="crop-label">{crop.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CropSelector;