const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// Get all books
async function getAllBooks() {
  const res = await axios.get(`${BASE_URL}/books`);
  console.log(res.data);
}

// Get by ISBN
async function getByISBN(isbn) {
  const res = await axios.get(`${BASE_URL}/books/isbn/${isbn}`);
  console.log(res.data);
}

// Get by Author
async function getByAuthor(author) {
  const res = await axios.get(`${BASE_URL}/books/author/${author}`);
  console.log(res.data);
}

// Get by Title
async function getByTitle(title) {
  const res = await axios.get(`${BASE_URL}/books/title/${title}`);
  console.log(res.data);
}

// Run tests
getAllBooks();
getByISBN("111");
getByAuthor("John");
getByTitle("Node");