const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',        // Host
  user: 'root',             // Username
  password: '',             // Password
  database: 'book_list'     // Database name
});


// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// API endpoint to add a book
app.post('/books', (req, res) => {
  const { title, status, lastChapter } = req.body;
  const query = 'INSERT INTO books (title, status, lastChapter) VALUES (?, ?, ?)';
  db.query(query, [title, status, lastChapter], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, title, status, lastChapter });
  });
});

// API endpoint to get all books
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(204).send();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
