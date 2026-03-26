// Express
//npx nodemon
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

//express instance
const app = express();

//middlewar for json
app.use(express.json());
app.use(cors());

//connecting to mongodb
mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => {
    console.log("DB connected!");
  })
  .catch((error) => {
    console.log(error);
  });

// create schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

//create model
const todoModel = mongoose.model("Todo", todoSchema);

// app.get('/',(req,res) => {
//     res.send("Hello world");
// })

// sample in-memory storage
// let todos = [];

// Create a new todo item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  // const newTodo = {
  //     id: todos.length+1,
  //     title,
  //     description
  // }
  // todos.push(newTodo);
  // console.log(newTodo);

  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
    console.log(500).json({ message: err.message });
  }
});

// Get all items
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (err) {
    console.log(err);
    console.log(500).json({ message: err.message });
  }

  // res.json(todos);
  // console.log("success")
});

// update a todo item
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );

    if (!updatedTodo) {
      return res.statusCode(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (err) {
    console.log(err);
    console.log(500).json({ message: err.message });
  }
});

// delete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    console.log(500).json({ message: err.message });
  }
});

// start the server
const port = 8000;
app.listen(port, () => {
  console.log("Server listening to port " + port);
});
