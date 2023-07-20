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
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    console.log(isbn);
    return res.status(200).setHeader('content-type', 'application/json').send(`${isbn}: ${JSON.stringify(books[isbn])}`);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let returnbooklist = {};
    Object.entries(books).forEach(([isbn, details]) => {
        if(details.author == author)returnbooklist[isbn]=details;
     });
  return res.status(200).json(returnbooklist);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let returnbooklist = {};
    Object.entries(books).forEach(([isbn, details]) => {
        if(details.title == title)returnbooklist[isbn]=details;
     });
  return res.status(200).json(returnbooklist);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
