const axios = require('axios');

// DUMMY DATA to prevent crashes and ensure the server returns data
const dummyBooks = [
    { id: 1, isbn: "9780140449136", title: "Lord of the Flies", author: "William Golding" },
    { id: 2, isbn: "9780061120084", title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 3, isbn: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen" }
];

/**
 * 1. Retrieve all books using Async/Await
 */
const getAllBooks = async () => {
  try {
    // Simulating an API call or DB fetch
    // In a real app, you might do: const response = await axios.get('http://db-service/books');
    return dummyBooks; 
  } catch (error) {
    console.error('Error fetching all books:', error.message);
    throw error;
  }
};

/**
 * 2. Search books by ISBN using Promises (.then())
 */
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      const result = dummyBooks.filter(book => book.isbn === isbn);
      if (result.length > 0) {
        resolve(result);
      } else {
        resolve([]); // Return empty array if not found
      }
    }, 10);
  });
};

/**
 * 3. Search books by Author using Promises (.then())
 */
const getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = dummyBooks.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
      resolve(result);
    }, 10);
  });
};

/**
 * 4. Search books by Title using Promises (.then())
 */
const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = dummyBooks.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
      resolve(result);
    }, 10);
  });
};

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBookByAuthor,
  getBookByTitle
};