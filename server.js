//import {roll} from "./lib/roll.js";
import minimist from "minimist";
import express, { json }  from "express";
import morgan from "morgan";
import fs from "fs";
import db from './database.js';

let args = minimist(process.argv.slice(2));
let expressApp = express();

var port = args.port || 5000; //either the port or 5000

expressApp.use(express.urlencoded({ extended: true })); //extending to url encoded or json doesn't matter and then listen
expressApp.listen(port);

expressApp.get("/app", (req, res) => { //get request
    res.status(200).send("200 OK"); //send 200 OK for the first thing
});
//currently only setup some of the endpoints
expressApp.post("/app/login", (req, res) => {  //for login
    let result = roll(6, 2, 1); 
    res.status(200).send(JSON.stringify(result)); 
});
expressApp.post("/app/logout", (req, res) => { //for logout
    let result = roll(6, 2, 1); 
    res.status(200).send(JSON.stringify(result)); 
});
expressApp.post("/app/post", (req, res) => { //for posting
    let result = roll(6, 2, 1); 
    res.status(200).send(JSON.stringify(result)); 
});
expressApp.get("/app/getpost", (req, res) => { //for getting a post
    let result = roll(6, 2, 1); 
    res.status(200).send(JSON.stringify(result)); 
});

// Create user endpoint
expressApp.post('/app/user/new/', (req, res, next) => {
    let userData = {
        username: req.body.username, 
        password: req.body.password,
    }
    const stmt = db.prepare('INSERT INTO userinfo (username, password) VALUES (?, ?)');
    const info = stmt.run(userData.username, userData.password);
    res.status(200).json({"message": "user " + userData.username + " created"});
})
// Read user info endpoint 
expressApp.get('/app/user/info/:username', (req, res, next) => {
    try{
        const stmt = db.prepare('SELECT * FROM userinfo WHERE username = ?')
        const info = stmt.get(req.params.username);
        res.status(200).json(info);
    }
    catch{
        console.error(e)
    }
})
// Modify user info endpoint
expressApp.patch('/app/user/info/update/:username/', (req, res, next) => {
    let userData = {
        username:req.params.username,
        password:req.params.password
    }
    const stmt = db.prepare('UPDATE userinfo SET password = COALESCE(?, password) WHERE username = ?');
    const info = stmt.run(userData.password, req.params.id);
    res.status(200).json(info);
})
// Delete user info endpoint
expressApp.delete('app/user/delete/:username', (req, res) => {
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