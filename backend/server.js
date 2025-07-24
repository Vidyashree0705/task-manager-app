const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./tasks.json";

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks(tasks);
  res.status(204).end();
});

app.put("/api/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const updatedTask = {  id: taskId,...req.body };
  tasks = tasks.map((task) => (task.id === taskId ? updatedTask : task));
  saveTasks(tasks);
  res.json(updatedTask);
});

app.listen(PORT, () => {
  console.log(` Backend running at http://localhost:${PORT}`);
});
