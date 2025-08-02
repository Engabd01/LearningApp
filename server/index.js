// Import necessary packages
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Create an Express application
const app = express();

// Set the port for the server, using a default value if not specified in .env
const PORT = process.env.PORT || 5000;

// Middleware setup
// Enable CORS for all origins, allowing your React app to make requests
app.use(cors());
// Parse incoming JSON requests, making it available on `req.body`
app.use(express.json());

// Create a PostgreSQL connection pool. This is more efficient for handling
// multiple connections than a single client instance.
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  // Add this SSL configuration to fix the "SSL/TLS required" error
  ssl: {
    // This setting is required for self-signed certificates, which are
    // common in development and some cloud services.
    rejectUnauthorized: false
  },
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to the database', err.stack);
  }
  console.log('Successfully connected to the PostgreSQL database!');
  release(); // Release the client back to the pool
});

// --- API Endpoints for Todo Tasks ---

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new todo
app.post('/api/todos', async (req, res) => {
  try {
    // Extract the task from the request body
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }
    // SQL query to insert a new todo, returning the new row
    const result = await pool.query(
      'INSERT INTO todos (task) VALUES ($1) RETURNING *',
      [task]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT to update a todo (e.g., toggle completed status)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;

    let queryText = 'UPDATE todos SET ';
    let queryParams = [];
    let setClauses = [];

    // Dynamically build the query based on what is provided in the body
    if (task !== undefined) {
      setClauses.push(`task = $${setClauses.length + 1}`);
      queryParams.push(task);
    }
    if (completed !== undefined) {
      setClauses.push(`completed = $${setClauses.length + 1}`);
      queryParams.push(completed);
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    queryText += setClauses.join(', ') + ' WHERE id = $' + (queryParams.length + 1) + ' RETURNING *';
    queryParams.push(id);

    const result = await pool.query(queryText, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add these routes to your index.js file in the server

// --- API Endpoints for Notes ---

// GET all notes (for the dropdown)
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, created_at, updated_at FROM notes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notes:', err.message);
    res.status(500).json({ error: 'Server error while fetching notes' });
  }
});

// GET a specific note by ID
app.get('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching note:', err.message);
    res.status(500).json({ error: 'Server error while fetching note' });
  }
});

// POST a new note (optional - for adding notes)
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title || null, content]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).json({ error: 'Server error while creating note' });
  }
});

// PUT to update a note (optional)
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title || null, content, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating note:', err.message);
    res.status(500).json({ error: 'Server error while updating note' });
  }
});

// DELETE a note (optional)
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err.message);
    res.status(500).json({ error: 'Server error while deleting note' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
