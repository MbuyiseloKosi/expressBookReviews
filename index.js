const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import your general.js functions
// Ensure general.js is in the same folder as index.js
const general = require('./general');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- BOOK ROUTES ---
// This handles: GET /api/books, GET /api/books?isbn=..., etc.
app.get('/api/books', (req, res) => {
    const { isbn, author, title } = req.query;

    // If query params exist, use the specific Promise-based functions
    if (isbn) {
        general.getBookByISBN(isbn)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err.message }));
    } else if (author) {
        general.getBookByAuthor(author)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err.message }));
    } else if (title) {
        general.getBookByTitle(title)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err.message }));
    } else {
        // No query params -> Get All (Async/Await function)
        general.getAllBooks()
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ error: err.message }));
    }
});

// --- MOCK USER ROUTES (For Testing) ---
// Since we don't have your DB setup, we use a simple in-memory store for registration/login
const users = [];
let tokenCounter = 0;

app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    if (users.find(u => u.username === username)) return res.status(400).json({ error: "User already exists" });
    
    users.push({ username, password });
    res.json({ message: "User registered successfully" });
});

app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    // Generate a simple mock token for testing
    const token = `mock-jwt-token-${Date.now()}-${Math.random()}`;
    res.json({ token });
});

// --- MOCK REVIEW ROUTES (For Testing) ---
const reviews = [];

app.get('/api/reviews', (req, res) => {
    const { bookId } = req.query;
    if (bookId) {
        res.json(reviews.filter(r => r.bookId === bookId));
    } else {
        res.json(reviews);
    }
});

app.post('/api/reviews', (req, res) => {
    const { bookId, comment, rating } = req.body;
    // Check for auth header (mock check)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const newReview = {
        id: reviews.length + 1,
        bookId,
        comment,
        rating,
        user: "testuser"
    };
    reviews.push(newReview);
    res.json({ message: "Review added", review: newReview });
});

app.delete('/api/reviews/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: "Review not found" });
    
    reviews.splice(index, 1);
    res.json({ message: "Review deleted" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;