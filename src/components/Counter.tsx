import React, { useState } from 'react';

interface CounterProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
}

export const Counter: React.FC<CounterProps> = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 0
}) => {
  const [value, setValue] = useState<number>(initialValue);

  const increment = () => {
    setValue(prev => Math.min(prev + step, max));
  };

  const decrement = () => {
    setValue(prev => Math.max(prev - step, min));
  };

  const reset = () => {
    setValue(initialValue);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }}>
      <button onClick={decrement} disabled={value <= min}>
        -
      </button>
      <span style={{ minWidth: '40px', textAlign: 'center' }}>
        {value}
      </span>
      <button onClick={increment} disabled={value >= max}>
        +
      </button>
      <button onClick={reset}>
        Reset
      </button>
    </div>
  );
};