// =======================
// SETUP
// =======================
// 1. npm init -y
// 2. npm install express jsonwebtoken express-session body-parser

const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const SECRET = "secretkey";

app.use(bodyParser.json());
app.use(session({ secret: "sessionsecret", resave: false, saveUninitialized: true }));

// =======================
// DATA (IN-MEMORY)
// =======================
let users = [];

let books = {
  "111": { title: "Node Basics", author: "John Doe", reviews: {} },
  "222": { title: "Learn Express", author: "Jane Smith", reviews: {} },
};

// =======================
// MIDDLEWARE
// =======================
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// =======================
// AUTH ROUTES
// =======================
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User exists" });
  }

  users.push({ username, password });
  res.json({ message: "User registered" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// =======================
// BOOK ROUTES (ASYNC)
// =======================

// Get all books
app.get("/books", async (req, res) => {
  const data = await new Promise(resolve => setTimeout(() => resolve(books), 100));
  res.json(data);
});

// Get by ISBN
app.get("/books/isbn/:isbn", async (req, res) => {
  const book = await new Promise(resolve => setTimeout(() => resolve(books[req.params.isbn]), 100));
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book);
});

// Get by author
app.get("/books/author/:author", async (req, res) => {
  const result = Object.values(books).filter(b => b.author.toLowerCase().includes(req.params.author.toLowerCase()));
  res.json(result);
});

// Get by title
app.get("/books/title/:title", async (req, res) => {
  const result = Object.values(books).filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
  res.json(result);
});

// Get reviews
app.get("/books/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Not found" });
  res.json(book.reviews);
});

// =======================
// PROTECTED ROUTES
// =======================

// Add or update review
app.put("/books/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  books[isbn].reviews[username] = review;
  res.json({ message: "Review added/updated" });
});

// Delete review
app.delete("/books/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(403).json({ message: "Not allowed" });
  }

  delete books[isbn].reviews[username];
  res.json({ message: "Review deleted" });
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// =======================
// TEST WITH CURL
// =======================
/*
Register:
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"user1","password":"1234"}'

Login:
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"user1","password":"1234"}'

Get books:
curl http://localhost:3000/books

Add review:
curl -X PUT http://localhost:3000/books/review/111 -H "Authorization: TOKEN" -H "Content-Type: application/json" -d '{"review":"Great book"}'
*/
