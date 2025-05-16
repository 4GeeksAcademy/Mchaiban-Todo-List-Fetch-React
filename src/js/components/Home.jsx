// src/js/components/Home.jsx
import React, { useState, useEffect } from "react";

// Base user endpoint: GET list & POST reset
const USER_API  = "https://playground.4geeks.com/todo/users/mchaiban";
// Todos endpoint for CRUD: POST new & DELETE by id
const TODOS_API = "https://playground.4geeks.com/todo/todos/mchaiban";


export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos]           = useState([]);

  // Load tasks: GET user endpoint, unpack body.todos
  const loadTodos = () => {
    fetch(USER_API)
        .then(res => {
      if (!res.ok) throw new Error(`Load failed: ${res.status}`);
      return res.json();
    })
    .then(body => setTodos(body.todos))
    .catch(err => {
      console.error("loadTodos:", err);
      createUser()});
  };

  const createUser = () => {
     fetch(USER_API, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify([]),
    })
    .then(res => {
      if (!res.ok) throw new Error(`Load failed: ${res.status}`);
      return res.json();
    })
    .then(() => loadTodos())
    .catch(e => console.warn("User init error:", e))
  }

  // Initialize/reset list on mount
  useEffect(() => {
   
    loadTodos()
  }, []);

  // Add a new task: POST to /users/.../todos
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      fetch(TODOS_API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ label: inputValue.trim(), done: false }),
      })
        .then(res => {
          if (!res.ok) throw new Error(`Add failed: ${res.status}`);
          return res.json();
        })
        .then(() => setInputValue(""))
        .then(() => loadTodos())
        .catch(err => console.error("addTask:", err));
    }
  };

  // Remove one task: DELETE by id on /users/.../todos/:id
  const removeTodo = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      })
      .then(() => loadTodos())
      .catch(err => console.error("removeTodo:", err));
  };

  // Clear all tasks: DELETE each then clear state
  const clearAll = () => {
    Promise.all(
      todos.map(t =>
        fetch(`${TODOS_API}/${t.id}`, { method: "DELETE" })
      )
    )
      .then(() => setTodos([]))
      .catch(err => console.error("clearAll:", err));
  };

  return (
    <div className="container">
      <h1>Todos:</h1>
      <ul>
        <li className="todo-item">
          <input
            type="text"
            placeholder="No tasks, add a task"
            style={{ width: "100%" }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </li>
        {todos.map(t => (
          <li key={t.id} className="todo-item">
            {t.label}
            <i
              className="delete-icon fa-solid fa-xmark"
              onClick={() => removeTodo(t.id)}
            />
          </li>
        ))}
      </ul>
      <div>
        {todos.length} item{todos.length !== 1 && "s"} left
        {todos.length > 0 && (
          <button className="btn btn-sm ms-3" onClick={clearAll}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
