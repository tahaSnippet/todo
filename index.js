const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // replace with your MySQL username
  password: 'password',       // replace with your MySQL password
  database: 'todo' // replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to add a task using a POST request
app.post('/add-task', (req, res) => {
  const newTask = req.body.task;
  const sql = 'INSERT INTO tasks (task) VALUES (?)';
  db.query(sql, [newTask], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Task added...', id: result.insertId });
  });
});

// Route to get all tasks
app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route to delete a task
app.delete('/delete-task/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [taskId], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Task deleted...' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
