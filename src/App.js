// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos', error));
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      axios.post('http://localhost:3001/todos', { text: newTodo })
        .then(response => {
          setTodos([...todos, response.data]);
          setNewTodo('');
          setShowWarning(false); // Reset warning when a valid todo is added
        })
        .catch(error => console.error('Error adding todo', error));
    } else {
      setShowWarning(true); // Display warning when no value is entered
    }
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3001/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(error => console.error('Error deleting todo', error));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete ${todo.text}`}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {showWarning && (
        <div className="warning">Please enter a value for the todo.</div>
      )}
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="New Todo"
          className="input-field"
        />
        <button
          onClick={addTodo}
          aria-label="Add Todo"
          className="add-todo-button"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}

export default App;

