const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// Get all books
async function getAllBooks() {
    try {
        const res = await axios.get(`${BASE_URL}/books`);
        console.log(res.data);
    } catch (err) {
        console.error(err.message);
    }
}

// Get by ISBN
async function getByISBN(isbn) {
    try {
        const res = await axios.get(`${BASE_URL}/books/isbn/${isbn}`);
        console.log(res.data);
    } catch (err) {
        console.error(err.message);
    }
}

// Get by Author
async function getByAuthor(author) {
    try {
        const res = await axios.get(`${BASE_URL}/books/author/${author}`);
        console.log(res.data);
    } catch (err) {
        console.error(err.message);
    }
}

// Get by Title
async function getByTitle(title) {
    try {
        const res = await axios.get(`${BASE_URL}/books/title/${title}`);
        console.log(res.data);
    } catch (err) {
        console.error(err.message);
    }
}

// Example calls (you can comment/uncomment)
getAllBooks();
getByISBN("111");
getByAuthor("John");
getByTitle("Node");