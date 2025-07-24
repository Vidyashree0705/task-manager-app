import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    if (!taskName || !taskDetails) return;

    if (editId) {
      await axios.put(`http://localhost:5000/api/tasks/${editId}`, {
        title: taskName,
        description: taskDetails,
      });
    } else {
      await axios.post("http://localhost:5000/api/tasks", {
        title: taskName,
        description: taskDetails,
      });
    }

    setTaskName("");
    setTaskDetails("");
    setEditId(null);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setTaskName(task.title);
    setTaskDetails(task.description);
    setEditId(task.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
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
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={() => handleEdit(task)}>✏️ Edit</button>
          <button onClick={() => handleDelete(task.id)}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
