// client/src/App.js
import { useState } from 'react';
import './App.css'; // Assuming your calendar styles are here or in index.css
import Greeting from './component/greeting';
import Counter from './component/Counter';
import TodoList from './component/TodoList';
import Calendar from './component/Calendar'; // Ensure this path is correct
import NoteReader from './component/NoteReader';


// Main App component
export default function App() {
  const [userName, setUserName] = useState('Student');
  const [userAge, setUserAge] = useState(25);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Abdulla Aldhaheri App</h1>
        <p>A simple app demonstrating components, props, state, and events</p>
      </header>

      {/* User input section */}
      <div className="user-info-card">
        <h3>User Info</h3>
        <div className="input-group">
          <div className="input-field">
            <label>Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>Age:</label>
            <input
              type="number"
              value={userAge}
              onChange={(e) => setUserAge(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <NoteReader />
      <p>it should be here</p>
      {/* Pass props to child component */}
      <Greeting name={userName} age={userAge} />

      {/* Counter component with state */}
      <Counter />

      {/* Todo list component */}
      <TodoList />

      {/* Calendar component - UNCOMMENTED */}
      <Calendar />

      <footer className="app-footer">
        <p>Key React concepts demonstrated:</p>
        <p>• Components • Props • State (useState) • Event Handling • Conditional Rendering</p>
      </footer>
    </div>
  );
}
