import { useState } from 'react';
import HealthSummaryCard from './cards/HealthSummaryCard';
import WaterStressCard from './cards/WaterStressCard';
import TrendComparisonCard from './cards/TrendComparisonCard';
import '../styles/SwipeableCards.css';

const SwipeableCards = ({data, cropName}:any )=> {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = 3;

  const nextCard = () => setActiveIndex((prev) => (prev + 1) % totalCards);
  const prevCard = () => setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);

  return (
    <div className="swipe-container">
      {/*console.log(data, cropName)*/}
      <div className="slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        <div className="slide"><HealthSummaryCard data={data} /></div>
        <div className="slide"><WaterStressCard data={data} /></div>
        <div className="slide"><TrendComparisonCard cropName={cropName} /></div>
      </div>

      <div className="navigation-controls">
        <button onClick={prevCard} className="nav-btn">←</button>
        <div className="dots">
          {[0, 1, 2].map(i => (
            <span key={i} className={`dot ${i === activeIndex ? 'active' : ''}`} onClick={() => setActiveIndex(i)} />
          ))}
        </div>
        <button onClick={nextCard} className="nav-btn">→</button>
      </div>
    </div>
  );
};

export default SwipeableCards;