const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("../books.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => users.some((u) => u.username === username);

const authenticatedUser = (username, password) =>
  users.some((u) => u.username === username && u.password === password);

// Task 7: Register
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  if (isValid(username))
    return res.status(409).json({ message: "User already exists!" });
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Task 8: Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  if (!authenticatedUser(username, password))
    return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  req.session.authorization = { accessToken: token, username };
  return res.status(200).json({ message: "User successfully logged in", token });
});

// Task 9: Add or update a review (must be logged in)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.session.authorization?.username;
  if (!username) return res.status(401).json({ message: "Unauthorized. Please login." });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!review) return res.status(400).json({ message: "Review text is required" });
  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: `Review for ISBN ${isbn} added/updated successfully by ${username}`,
    reviews: books[isbn].reviews,
  });
});

// Task 10: Delete a review (must be logged in)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization?.username;
  if (!username) return res.status(401).json({ message: "Unauthorized. Please login." });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!books[isbn].reviews[username])
    return res.status(404).json({ message: "No review found for this user" });
  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Review for ISBN ${isbn} deleted successfully by ${username}`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;