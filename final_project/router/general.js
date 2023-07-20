const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || ! password)return res.status(400).json({message: "Error: Username or password missing!"});
    if(username in users)return res.status(400).json({message: "Error: Username already exists!"});
    
    // Add user
    users[username]=password;
    res.status(200).json({message: "User has been registerd!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise((resolve,reject) => {
        resolve({"status":200, "msg":books}); 
    })
   
    promise
    .then(e => {return res.status(e.status).json(e.msg)})
    .catch(e => {return res.status(e.status).send(e.msg)});
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let promise = new Promise((resolve,reject) => {
        const isbn = req.params.isbn;
        if (!isbn || !(isbn in books))reject({"status":400, "msg":"ERROR: isbn not found!"});
        resolve({"status":200, "msg":`${isbn}: ${JSON.stringify(books[isbn])}`}); 
    })
   
    promise
    .then(e => {return res.status(e.status).setHeader('content-type', 'application/json').send(e.msg)})
    .catch(e => {return res.status(e.status).send(e.msg)});
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let promise = new Promise((resolve,reject) => {
        const author = req.params.author;
        let returnbooklist = {};
        Object.entries(books).forEach(([isbn, details]) => {
            if(details.author == author)returnbooklist[isbn]=details;
        });

        resolve({"status":200, "msg":returnbooklist}); 
    })
   
    promise
    .then(e => {return res.status(e.status).json(e.msg)})
    .catch(e => {return res.status(e.status).send(e.msg)});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let promise = new Promise((resolve,reject) => {
        const title = req.params.title;
    let returnbooklist = {};
    Object.entries(books).forEach(([isbn, details]) => {
        if(details.title == title)returnbooklist[isbn]=details;
     });

        resolve({"status":200, "msg":returnbooklist}); 
    })
    promise
    .then(e => {return res.status(e.status).json(e.msg)})
    .catch(e => {return res.status(e.status).send(e.msg)});
   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    console.log(isbn);
    return res.status(200).json(books[isbn].reviews);
  
});

module.exports.general = public_users;
