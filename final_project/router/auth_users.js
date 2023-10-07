const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    if (users.some((user) => user.username === username)) {
        return false;
  }
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

regd_users.post('/register',(req,res)=>{
    const { username, password } = req.body;
    console.log(req);
    if (!username || !password) {
        return res.status(404).json({ message: 'Username and password are required' });
    }
    if(!isValid(username))
        res.status(404).json({ message: 'Username already exists' })
    const newUser = { username, password };
    users.push(newUser);
    console.log(users)
    res.status(200).json({ message: `User ${newUser.username} registered successfully` });
})

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(users)
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });
      
        req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const userName = req.user;

    if (books[isbn]) {
        if (!books[isbn].reviews){
            books[isbn].reviews = {};
        }
        books[isbn].reviews[userName] = review;
        res.status(200).json({ message: 'Review added or modified successfully',"book": books[isbn]});

    }
    else{
        res.status(404).json({ message: 'Book not found' });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const userName = req.user;

    if (books[isbn]) {
        delete books[isbn].reviews[userName];
        res.status(200).json({ message: 'Review deleted',"book": books[isbn]});

    }
    else{
        res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
