const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  try{
    res.json(books);
  }catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch book data' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const filtered_books = [];
  
    for (const key of bookKeys) {
      if (books[key].author === author) {
        filtered_books.push(books[key]);
      }
    }
  
    res.send(filtered_books);
  });

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const filtered_books = [];
  
    for (const key of bookKeys) {
      if (books[key].title === title) {
        filtered_books.push(books[key]);
      }
    }
  
    res.send(filtered_books);
  });

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      const reviews = book.reviews || [];
      res.send(reviews);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });

module.exports.general = public_users;
