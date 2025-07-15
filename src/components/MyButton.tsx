import React, { useState } from 'react';

 interface MyButtonProps {
  label: string;
  initialCount?: number;
  onClick?: (count: number) => void;
}

export const MyButton: React.FC<MyButtonProps> = ({ 
  label, 
  initialCount = 0, 
  onClick 
}) => {
  const [count, setCount] = useState<number>(initialCount);

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    onClick?.(newCount);
  };

  return (
    <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        {label}
      </button>
    </div>
  );
};