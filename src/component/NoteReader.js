// client/src/components/NoteReader.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../NoteReader.css'; // You'll need to create this CSS file

const API_URL = 'http://localhost:5000/api/notes';

export default function NoteReader() {
  const [note, setNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all notes for the dropdown
  const fetchAllNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
      if (response.data.length > 0) {
        setSelectedNoteId(response.data[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching notes list:', err);
      setError('Failed to fetch notes list');
    }
  };

  // Fetch a specific note by ID
  const fetchNoteById = async (noteId) => {
    if (!noteId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/${noteId}`);
      setNote(response.data);
    } catch (err) {
      console.error('Error fetching note:', err);
      setError('Failed to fetch note. Please ensure the note exists.');
    } finally {
      setLoading(false);
    }
  };

  // Load notes list on component mount
  useEffect(() => {
    fetchAllNotes();
  }, []);

  // Load selected note when selectedNoteId changes
  useEffect(() => {
    if (selectedNoteId) {
      fetchNoteById(selectedNoteId);
    }
  }, [selectedNoteId]);

  const handleNoteSelect = (e) => {
    setSelectedNoteId(e.target.value);
  };

  const handleRefresh = () => {
    if (selectedNoteId) {
      fetchNoteById(selectedNoteId);
    }
  };

  if (error && notes.length === 0) {
    return (
      <div className="note-reader-container note-error-container">
        <h3>Note Reader</h3>
        <p className="note-error">{error}</p>
        <button onClick={fetchAllNotes} className="note-retry-btn">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="note-reader-container">
      <h3>Note Reader</h3>
      
      {/* Note Selection Dropdown */}
      <div className="note-selector">
        <label htmlFor="note-select">Select a note:</label>
        <select 
          id="note-select"
          value={selectedNoteId} 
          onChange={handleNoteSelect}
          className="note-select"
        >
          <option value="">Choose a note...</option>
          {notes.map(noteItem => (
            <option key={noteItem.id} value={noteItem.id}>
              {noteItem.title || `Note ${noteItem.id}`} - {new Date(noteItem.created_at).toLocaleDateString()}
            </option>
          ))}
        </select>
        <button onClick={handleRefresh} className="note-refresh-btn">
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="note-loading">
          Loading note...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="note-error">
          {error}
        </div>
      )}

      {/* Note Display */}
      {note && !loading && (
        <div className="note-display">
          <div className="note-header">
            <h4 className="note-title">
              {note.title || `Note #${note.id}`}
            </h4>
            <span className="note-date">
              Created: {new Date(note.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="note-content">
            <p>{note.content}</p>
          </div>
          
          <div className="note-meta">
            <small>Note ID: {note.id}</small>
            {note.updated_at && (
              <small>Last updated: {new Date(note.updated_at).toLocaleDateString()}</small>
            )}
          </div>
        </div>
      )}

      {/* No Note Selected */}
      {!note && !loading && !error && notes.length > 0 && (
        <div className="note-placeholder">
          Please select a note to display.
        </div>
      )}

      {/* No Notes Available */}
      {notes.length === 0 && !error && (
        <div className="note-placeholder">
          No notes available in the database.
        </div>
      )}
    </div>
  );
}