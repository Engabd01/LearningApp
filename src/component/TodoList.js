// client/src/component/TodoList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../TodoList.css';

// TODO: Replace this with the public URL of your deployed backend server.
// Example: const API_URL = 'https://your-backend-service-name.onrender.com/api/todos';
const API_URL = 'http://dpg-d20pqpbipnbc73dhvv50-a.oregon-postgres.render.com';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch todos from the server
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to fetch todos. Please ensure your backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to handle adding a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(API_URL, { task: newTask });
      setTodos([...todos, response.data]);
      setNewTask('');
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
    }
  };

  // Function to handle toggling a todo's completed status
  const handleToggleTodo = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('Failed to update todo status.');
    }
  };

  // Function to handle deleting a todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo.');
    }
  };

  if (loading) {
    return <div className="todo-list-container">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="todo-list-container todo-error-container">
        <p className="todo-error">{error}</p>
        <button onClick={fetchTodos} className="todo-retry-btn">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <h3>Todo List</h3>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="todo-add-btn">Add Task</button>
      </form>
      <ul className="todo-items">
        {todos.length === 0 ? (
          <p>No tasks to display. Add a new one!</p>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <span
                onClick={() => handleToggleTodo(todo.id, todo.completed)}
                className={`todo-task ${todo.completed ? 'completed' : ''}`}
              >
                {todo.task}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="todo-delete-btn"
              >
                &times;
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
