import minimist from "minimist";
import express, { json }  from "express";
import morgan from "morgan";
import fs from "fs";
import db from './database.js';
import cors from 'cors';


let args = minimist(process.argv.slice(2));
let expressApp = express();

//Create accesslog file stream
const accesslog = fs.createWriteStream('./access.log',  {flags: 'a'});
//Use morgan to log every API call
expressApp.use(morgan('combined', { stream: accesslog }));

var port = args.port || 5000; //either the port or 5000
if(args.port == 4000){
    console.log("4000 is used for webpage. Server redirected to port 5000.");
    port = 5000;
}

var loggedIn = false;
var currentUser;
expressApp.use(express.urlencoded({ extended: true }));

// parse application/json
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true })); //extending to url encoded or json doesn't matter and then listen
expressApp.use(cors());
expressApp.listen(port);

expressApp.use(express.static('./public'))

// See /app/ documentation
// returns 200 OK message
// checks if logged in and returns the users username
expressApp.get("/app", (req, res) => {
    if (loggedIn) {
        return res.status(200).send("200 OK\nCurrently logged in as: "+currentUser.username);
    }
    else {
        return res.status(200).end()
    }
});

// See /app/login/ documentation
// Enter username and password
// Checks to see if username and password are in the database
expressApp.post("/app/login", (req, res) => { 
    var newUserData = {
        username: req.body.username, 
        password: req.body.password
    }
    if (loggedIn) {
        return res.status(200).send("You are already logged in as " + currentUser.username + ".")
    }else {
        var stmt = db.prepare('SELECT * FROM userinfo');
        const currentUsers = stmt.all();
        for(var i in currentUsers){
            if (newUserData.username == currentUsers[i].username) {
                if (newUserData.password == currentUsers[i].password) {
                    loggedIn = true;
                    currentUser = newUserData;
                    var stmt = db.prepare('INSERT INTO userinfo (username, password) VALUES (?, ?)');
                    const info = stmt.run(newUserData.username, newUserData.password);
                    return res.status(200).send("Logged in as " + newUserData.username)
                }   
            }
        }
        return res.status(200).send("This user does not exist.") // username not found
    }
});

expressApp.post("/app/logout", (req, res) => { 
    if (loggedIn) {
        currentUser = null
        loggedIn = false;
        return res.status(200).send("Successfully logged out.")
    } else {
        return res.status(200).send("You are not logged in.")
    }
});

// See /app/createuser/ documentation
// Creates a user by taking in a username and password 
// Adds the username and password to the database
expressApp.post("/app/createuser", (req, res) => {
    let newUserData = {
        username: req.body.username, 
        password: req.body.password
    }
    var stmt = db.prepare('SELECT username FROM userinfo');
    const currentUsers = stmt.all();
    for(var i in currentUsers){ // search if username already exists
        if (newUserData.username == currentUsers[i].username) {
            return res.status(200).send("This username is already taken.")
        }
    }
    loggedIn = true;
    currentUser = newUserData;
    var stmt = db.prepare('INSERT INTO userinfo (username, password) VALUES (?, ?)');
    const info = stmt.run(newUserData.username, newUserData.password);
    res.status(200).json("New user " + newUserData.username + " has been created.");
})

// See /app/allusers documentation
// Returns all the users in the database
expressApp.get("/app/allusers", (req, res) => {
    const stmt = db.prepare('SELECT username FROM userinfo');
    const info = stmt.all();
    res.status(200).send(info);
})

// See /app/post documentation
// Takes the logged in user's username
// Adds a post to the post database with the signed in user
expressApp.post("/app/post", (req, res) => { 
    if (loggedIn) {
        const stmt = db.prepare('INSERT INTO posts (username, post) VALUES (?, ?)');
        const info = stmt.run(currentUser.username, req.body.post);
        res.status(200).json(info);
    } else {
        res.status(200).send("Please login to post.");
    }
});

// See /app/allposts documentation
// Returns all the posts in the database
expressApp.get('/app/allposts', (req, res) => {
    const stmt = db.prepare('SELECT * FROM posts');
    const info = stmt.all();
    res.status(200).send(info);
})

// See /app/getposts/:username/ documentation
// Takes a username in as a parameter
// Returns all posts from the specified user
expressApp.get("/app/getpost/:username/", (req, res) => {
    const stmt = db.prepare('SELECT * FROM posts WHERE username = ?');
    const info = stmt.all(req.params.username);
    res.status(200).send(info);
});

// See /app/user/info/:username/ documentation
// Returns how many posts an individual user has made
expressApp.get('/app/user/info/:username/', (req, res, next) => {
    try{
        const stmt1 = db.prepare('SELECT * FROM posts WHERE username = ?');
        const posts = stmt1.all(req.params.username);
        const stmt2 = db.prepare('SELECT username FROM userinfo WHERE username = ?');
        const info = stmt2.get(req.params.username);
        res.status(200).send("User "+req.params.username+" has made " + posts.length+" posts.");
    }
    catch{
        console.error(e);
    }
})
// See /app/user/info/update/:username/:password documentation
// Takes in the username and password for a user
// Replaces the old password with the new password in the database
expressApp.post('/app/user/info/update/:username/:password', (req, res, next) => {
    var password = req.body.password
    var newPassword = req.params.password
    var stmt = db.prepare('SELECT * FROM userinfo');
    const currentUsers = stmt.all();
    for(var i in currentUsers){ 
        if (req.params.username == currentUsers[i].username) { // check whether username exists
            if (password == currentUsers[i].password) { // verify password
                var stmt = db.prepare('UPDATE userinfo SET password = COALESCE(?, password) WHERE username = ?');
                const info = stmt.run(newPassword, req.params.username);
                return res.status(200).send("Password for "+req.params.username+" updated successfully.");
            } else {
                return res.status(200).send("Password did not match for user.");
            }
        }
    }
    return res.status(200).send("Username not found."); // user not found
})

// See /app/user/info/updatename/:username/:newusername documentation
// Takes in the username and newusername for a user
// Replaces the old username with the new username in the database
expressApp.post('/app/user/info/updatename/:username/:newusername', (req, res, next) => {
    var password = req.body.password
    var newusername = req.params.newusername
    var stmt = db.prepare('SELECT * FROM userinfo');
    const currentUsers = stmt.all();
    for(var i in currentUsers){ 
        if (req.params.username == currentUsers[i].username) { // check whether username exists
            if (password == currentUsers[i].password) { // verify password
                var stmt = db.prepare('UPDATE userinfo SET username = ? WHERE username = ?');
                const info = stmt.run(newusername, req.params.username);
                currentUser = {
                    username: newusername,
                    password: password
                }
                return res.status(200).send("Username updated from "+req.params.username+" to " + newusername + ".");
            } else {
                return res.status(200).send("Password did not match for user.");
            }
        }
    }
    return res.status(200).send("Username not found."); // user not found
})

// See /app/user/delete documentation
// Deletes the specified user from the database
expressApp.post('/app/user/delete', (req, res) => {
    let password = req.body.password;
    let username = req.body.username;
    var stmt = db.prepare('SELECT * FROM userinfo');
    const currentUsers = stmt.all();
    for(var i in currentUsers){
        if (username == currentUsers[i].username) {
            if (password == currentUsers[i].password) {
                const stmt = db.prepare('DELETE FROM userinfo WHERE username = ?');
                const info = stmt.run(username);
                return res.status(200).send("Successfully deleted user "+username+".");
            } else {
                return res.status(200).send("Incorrect password.")
            }
        }
    }
    return res.status(200).send("User not found.")
})

// Throws a 404 Error on any endpoint that is not specified
expressApp.get("*", (req, res) => {
    res.status(404).send("404 NOT FOUND");
});


