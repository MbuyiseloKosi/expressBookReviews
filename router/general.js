const express = require("express");
let books = require("../books.js");
const public_users = express.Router();

// Task 2: Get ALL books using async/await
public_users.get("/", async (req, res) => {
  try {
    const getAllBooks = () =>
      new Promise((resolve, reject) => {
        books ? resolve(books) : reject(new Error("No books found"));
      });
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 3: Get book by ISBN using Promise .then/.catch
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    book ? resolve(book) : reject(new Error(`Book with ISBN ${isbn} not found`));
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err.message }));
});

// Task 4: Get books by author using async/await
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const getByAuthor = () =>
      new Promise((resolve, reject) => {
        const result = Object.entries(books)
          .filter(([, b]) => b.author.toLowerCase().includes(author))
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
        Object.keys(result).length
          ? resolve(result)
          : reject(new Error(`No books found by author: ${req.params.author}`));
      });
    const result = await getByAuthor();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 5: Get books by title using async/await
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const getByTitle = () =>
      new Promise((resolve, reject) => {
        const result = Object.entries(books)
          .filter(([, b]) => b.title.toLowerCase().includes(title))
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
        Object.keys(result).length
          ? resolve(result)
          : reject(new Error(`No books found with title: ${req.params.title}`));
      });
    const result = await getByTitle();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 6: Get book reviews
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;