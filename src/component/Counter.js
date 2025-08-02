
import React from 'react';
import { useState } from 'react';


// Counter component to demonstrate state
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <h3>Counter</h3>
      <p className="counter-display">{count}</p>
      <div className="button-group">
        <button 
          onClick={() => setCount(count + 1)}
          className="btn btn-increment"
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          className="btn btn-decrement"
        >
          Decrement
        </button>
        <button 
          onClick={() => setCount(0)}
          className="btn btn-reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Counter;