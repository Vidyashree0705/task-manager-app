const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // 👈 Load env variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("❌ MongoDB connection error:", error));
db.once("open", () => console.log("✅ Connected to MongoDB database"));

// Task schema
const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

// Get all active tasks (not deleted)
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ deletedAt: { $exists: false } }).sort({ _id: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Soft delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { timestamps: false }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
