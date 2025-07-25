import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [editId, setEditId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/api/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    if (!taskName || !taskDetails) return;

    const payload = {
      title: taskName,
      description: taskDetails,
    };

    if (editId) {
      await axios.put(`${API_URL}/api/tasks/${editId}`, payload);
    } else {
      await axios.post(`${API_URL}/api/tasks`, payload);
    }

    setTaskName("");
    setTaskDetails("");
    setEditId(null);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setTaskName(task.title);
    setTaskDetails(task.description);
    setEditId(task._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="App">
      <h1>Task List</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Details"
          value={taskDetails}
          onChange={(e) => setTaskDetails(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <div className="task-footer">
            <button onClick={() => handleEdit(task)}>✏️ Edit</button>
            <button onClick={() => handleDelete(task._id)}>🗑️ Delete</button>

            <div className="timestamp-container">
              <span className="timestamp-label">
                Created:{" "}
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString()
                  : "N/A"}
              </span>
              <span className="timestamp-label">
                Updated:{" "}
                {task.updatedAt
                  ? new Date(task.updatedAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
