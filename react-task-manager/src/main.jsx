import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { useState, useEffect } from "react";
import "./Main.css";

function Main() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleSubmit(e) {
    e.preventDefault();

    if (text.trim() === "") {
      setError("Task cannot be empty");
      return;
    }

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };

    setLoading(true);

    setTimeout(() => {
      setTasks((prev) => [...prev, newTask]);
      setText("");
      setError("");
      setLoading(false);
    }, 1000);
  }

  function fetchTasks() {
    setLoadingApi(true);

    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((res) => res.json())
      .then((data) => {
        const serverTasks = data.map((item) => ({
          id: item.id + Date.now(),
          text: item.title,
          completed: item.completed,
        }));

        setTasks(serverTasks);
        setLoadingApi(false);
      })
      .catch(() => setLoadingApi(false));
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function removeTask(id) {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  }

  const visibleTasks = tasks.filter((task) => {
    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? !task.completed
        : task.completed;

    const matchSearch = task.text
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <main>
      <h2>Task Manager</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || text.trim() === ""}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <button onClick={fetchTasks}>
        Load tasks from server
      </button>
      {loadingApi && <p>Loading from server...</p>}

      <hr />

      <input
        className="search"
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        {["all", "active", "done"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={filter === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>

      {visibleTasks.length === 0 && (
        <p className="empty">No tasks found</p>
      )}

      {visibleTasks.length > 0 && (
        <ul>
          {visibleTasks.map((task) => (
            <li key={task.id}>
              <span
                className={`task-text ${
                  task.completed ? "done" : ""
                }`}
                onClick={() => toggleTask(task.id)}
              >
                {task.text}
              </span>

              <button
                className="delete-btn"
                onClick={() => removeTask(task.id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Main;
