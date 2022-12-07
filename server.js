//import {roll} from "./lib/roll.js";
import minimist from "minimist";
import express, { json }  from "express";
import morgan from "morgan";
import fs from "fs";
import db from './database.js';
import http from 'http';
import cors from 'cors';

let args = minimist(process.argv.slice(2));
let expressApp = express();

var port = args.port || 5000; //either the port or 5000
if(args.port == 4000){
    console.log("4000 is used for webpage. Server redirected to port 5000.");
    port = 5000;
}

var loggedIn = false;
var currentUser;

expressApp.use(express.urlencoded({ extended: true })); //extending to url encoded or json doesn't matter and then listen
expressApp.use(cors());
expressApp.listen(port);

expressApp.get("/app", (req, res) => { //get request
    res.status(200).send("200 OK\nCurrently logged in as: "+currentUser.username); //send 200 OK for the first thing
});
//currently only setup some of the endpoints
expressApp.post("/app/login", (req, res) => {  //for login
    loggedIn = true;
    let userData = {
        username: req.body.username, 
        password: req.body.password,
    }
    currentUser = userData;
    const stmt = db.prepare('INSERT INTO userinfo (username, password) VALUES (?, ?)');
    const info = stmt.run(userData.username, userData.password);
    res.status(200).json({"message": "user " + userData.username + " created"});
});

expressApp.get("/app/allusers", (req, res) => {
    const stmt = db.prepare('SELECT username FROM userinfo');
    const info = stmt.all();
    res.status(200).send(info);
})

expressApp.post("/app/post", (req, res) => { 
    if (loggedIn) {
        const stmt = db.prepare('INSERT INTO posts (username, post) VALUES (?, ?)');
        const info = stmt.run(currentUser.username, req.body.post);
        res.status(200).json(info);
    } else {
        res.status(200).send("Please login to post.");
    }
});

expressApp.get('/app/allposts', (req, res) => {
    const stmt = db.prepare('SELECT * FROM posts');
    const info = stmt.all();
    res.status(200).send(info);
})

expressApp.get("/app/getpost/:username/", (req, res) => {
    const stmt = db.prepare('SELECT * FROM posts WHERE username = ?');
    const info = stmt.all(req.params.username);
    res.status(200).send(info);
});

expressApp.get('/app/user/info/:username/', (req, res, next) => {
    try{
        const stmt = db.prepare('SELECT * FROM userinfo WHERE username = ?');
        const info = stmt.get(req.params.username);
        res.status(200).json(info);
    }
    catch{
        console.error(e);
    }
})
// Modify user info endpoint
expressApp.post('/app/user/info/update/:username/', (req, res, next) => {
    const stmt = db.prepare('UPDATE userinfo SET password = COALESCE(?, password) WHERE username = ?');
    const info = stmt.run(req.body.password, req.params.username);
    res.status(200).json(info);
})
// Delete user info endpoint
expressApp.get('/app/user/delete/:username', (req, res) => {
    const stmt = db.prepare('DELETE FROM userinfo WHERE username = ?');
    const info = stmt.run(req.params.username);
    res.status(200).json(info);
})


expressApp.get("*", (req, res) => { //handle 404
    res.status(404).send("404 NOT FOUND");
});


//Create accesslog file stream
const accesslog = fs.createWriteStream('./access.log',  {flags: 'a'});
//Use morgan to log every API call
expressApp.use(morgan('combined', { stream: accesslog }));

fs.readFile(`./public/index.html`, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
      }
    
    const server = http.createServer((req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      })
    
    server.listen(4000, () => {
        console.log(`Website Server listening on port 4000`);
      });
    });