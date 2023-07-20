const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// I changed this into a better datastructure compared to list of dictionaries we now have a dictionary where the username us a primary key.
let users = {"jojo":"testpwd123"};


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || ! password)return res.status(400).json({message: "Error: Username or password missing!"});
    if(!(username in users) || users[username] != password)return res.status(400).json({message: "Error: Username or password incorrect!"});

    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60*60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  const review = req.body.review;

  if(!username)return res.status(500).json({message: "ERROR: Internal Server error!"});
  if(!isbn || ! review)return res.status(400).json({message: "ERROR: ISBN and reiview have to be provided!"});
  if(username in books[isbn].reviews){
    books[isbn].reviews[username]=review;
    return res.status(200).json({message: `Rieview for ISBN: ${isbn} has been updated!`});
  }
  books[isbn].reviews[username]=review;
  return res.status(200).json({message: `Rieview for ISBN: ${isbn} has been added!`});

  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization['username'];
    const isbn = req.params.isbn;

    if(!username)return res.status(500).json({message: "ERROR: Internal Server error!"});
    if(!isbn)return res.status(400).json({message: "ERROR: ISBN has to be provided!"});
    if(!(username in books[isbn].reviews))return res.status(400).json({message: "ERROR: No review to delete!"});







    
    delete books[isbn].reviews[username];
    
    return res.status(200).json({message: `Review for book with ISBN: ${isbn} has been deleted!`});
});

module.exports.authenticated = regd_users;
//module.exports.isValid = isValid;
module.exports.users = users;
