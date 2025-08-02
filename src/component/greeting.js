// Greeting.js
import React from 'react';

// Child component that receives props
function Greeting({ name, age }) {
  return (
    <div className="greeting-card">
      <h3>Hi, {name}! You are {age} so young!!.</h3>
    </div>
  );
}

export default Greeting;