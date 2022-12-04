//Load DB
import database from "better-sqlite3";
//Create database connection
const db = new database('data.db');


//Export DB
module.exports = db;