//import {roll} from "./lib/roll.js";
import minimist from "minimist";
import express  from "express";
import morgan from "morgan";
import db from "better-splite3";

let args = minimist(process.argv.slice(2));
let expressApp = express();

var port = args.port || 5000; //either the port or 5000

expressApp.use(express.urlencoded({ extended: true })); //extending to url encoded or json doesn't matter and then listen
expressApp.listen(port);

expressApp.get("*", (req, res) => { //handle 404
    res.status(404).send("404 NOT FOUND");
}   );

//Create accesslog file stream
const accesslog = fs.createWriteStream(logdir = '',  {flags: 'a'});
//Use morgan to log every API call
expressApp.use(morgan('combined', { stream: accesslog }));




/*
expressApp.get("/app", (req, res) => { //get request
  res.status(200).send("200 OK"); //send 200 OK for the first thing
});

expressApp.get("/app/roll", (req, res) => { //default section
    let result = roll(6, 2, 1); 
    res.status(200).send(JSON.stringify(result)); //send the result
});


expressApp.post("/app/roll", (req, res) => { //if given a post with a json body
    let result = roll(parseInt(req.body.sides), parseInt(req.body.dice), parseInt(req.body.rolls));
    res.status(200).send(JSON.stringify(result)); 
});

expressApp.get("/app/roll/:sides", (req, res) => { //if only sides
    let result = roll(parseInt(req.params.sides), 2, 1);
    res.status(200).send(JSON.stringify(result));
});

expressApp.get("/app/roll/:sides/:dice", (req, res) => { //if only sides and dice
    let result = roll(parseInt(req.params.sides), parseInt(req.params.dice), 1);
    res.status(200).send(JSON.stringify(result));
});

expressApp.get("/app/roll/:sides/:dice/:rolls", (req, res) => { //if all three
    let result = roll(parseInt(req.params.sides), parseInt(req.params.dice), parseInt(req.params.rolls));
    res.status(200).send(JSON.stringify(result));
});
*/

//do the 404 last to get rid of the autograder error
