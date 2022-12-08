//Load DB
import database from "better-sqlite3";
//Create database connection
const db = new database('data.db');
 const accessstmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`);
 let accessRow = accessstmt.get();
 if(accessRow == undefined){
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

const userstmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='userinfo';`);
let userRow = userstmt.get();
if(userRow == undefined){
    console.log('User database appears to be empty. Creating user database...')

    const userinfoInit = `
    CREATE TABLE userinfo (
        id INTEGER PRIMARY KEY, 
        username VARCHAR,  
        password VARCHAR
    );
    `
    db.exec(userinfoInit);
}else{
    console.log('User info table exists.')
}

const poststmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='posts';`);
let postRow = poststmt.get();
if(postRow == undefined){
    console.log('Post database appears to be empty. Creating post database...')
    const postinfoInit = `
        CREATE TABLE posts (
            username VARCHAR, 
            post VARCHAR
        );
        `
        db.exec(postinfoInit);
        }else{
    console.log('Post info table exists.')
    }

//Export DB
export default db;