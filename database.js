//Load DB
import database from "better-sqlite3";
//Create database connection
const db = new database('data.db');
const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='access';`);
let row = stmt.get();
if(row == undefined){
    console.log('Log database appears to be empty. Creating log database...');
    const sqlInit = `
        CREATE TABLE accesslog (
            id INTEGER PRIMARY KEY, 
            remote_addr VARCHAR, 
            remote_user VARCHAR, 
            date VARCHAR, 
            method VARCHAR, 
            url VARCHAR, 
            http_version VARCHAR, 
            status INTEGER, 
            content_length VARCHAR,
            referer_url VARCHAR,
            user_agent VARCHAR
        );
    `
    db.exec(sqlInit);
}else{
    console.log(`Database exists.`);
}

//Export DB
export default db;