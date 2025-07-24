// Updated Backend with Soft Delete Support
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tasklist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("❌ MongoDB connection error:", error));
db.once("open", () => console.log("✅ Connected to MongoDB database"));

const taskSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    description: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

// GET all tasks (excluding soft deleted)
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ deleted: false }).sort({ id: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST new task
app.post("/api/tasks", async (req, res) => {
  try {
    const lastTask = await Task.findOne().sort({ id: -1 });
    const newTask = new Task({
      id: lastTask ? lastTask.id + 1 : 1,
      title: req.body.title,
      description: req.body.description,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SOFT DELETE a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { deleted: true },
      { new: true }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      {
        title: req.body.title,
        description: req.body.description,
      },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});