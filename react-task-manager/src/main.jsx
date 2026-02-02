import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { useState, useEffect } from "react";
import "./Main.css";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import Search from "./components/Search";

function Main() {
  // 🔹 INPUT
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // 🔹 LOADING
  const [loading, setLoading] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);

  // 🔹 FILTER & SEARCH
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // 🔹 TASKS (INIT FROM localStorage)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔹 SAVE TO localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 🔹 ADD TASK (ASYNC IMITATION)
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

  // 🔹 FETCH TASKS FROM SERVER
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
      .catch(() => {
        setLoadingApi(false);
      });
  }

  // 🔹 TOGGLE TASK
  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // 🔹 REMOVE TASK
  function removeTask(id) {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  }

  // 🔹 FILTER + SEARCH (DERIVED STATE)
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

      {/* ADD FORM */}
      <TaskForm
        text={text}
        loading={loading}
        onChange={(e) => setText(e.target.value)}
        onSubmit={handleSubmit}
      />

      {/* ERROR */}
      {error && <p className="error">{error}</p>}

      {/* FETCH */}
      <button onClick={fetchTasks}>
        Load tasks from server
      </button>
      {loadingApi && <p>Loading from server...</p>}

      <hr />

      {/* SEARCH */}
      <Search
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <Filters
        filter={filter}
        onSelect={setFilter}
      />

      {/* LIST */}
      <TaskList
        tasks={visibleTasks}
        onToggle={toggleTask}
        onRemove={removeTask}
      />
    </main>
  );
}

export default Main;
