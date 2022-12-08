# group10-final-project

## Planning Documentation

- Creating a forum
    - Allows user to login to the forum
        - Usernames, encrypted passwords
    - Posts include information about who posted, time, etc.
        - Allow users to rate posts, thumbs-up/thumbs-down
    - Forum filtered by most recent posts
        - Themes/Topics added later
        - Replies can show up underneath posts
        - Filter by posts each user makes
- Backend Info
    - Database of users, posts, etc.

- Pages
    - [ ] Login
    - [ ] Logout
    - [ ] User Profile Page
    - [ ] Main forum/home page
    - [ ] Make post
    - [ ] Make reply

## Summary 

COMP426 final project template boilerplate.
All your code and documentation goes here.
Change this text to be a brief description of your final project.
Put the name of your project in the header above.
You will change everything below to be the main technical documentation, as outlined below.


## Endpoints

### /app/

Responds "200 OK" when not logged in. Responds "200 OK" "Currently logged in as: username"

#### Response body

```
curl http://localhost:5000/app/
```
```
200 OK
Currently logged in as: "username"
```

#### Headers

```
curl -I http://localhost:5000/app/
```
```
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: text/html; charset=utf-8
Content-Length: 36
ETag: W/"24-MYYi4IF/FqJlCj0cT4DsnKmuXac"
Date: Wed, 07 Dec 2022 23:35:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
### /app/login/
Responds "You are already logged in as " if has already logged in.
Responds "Logged in as " if username exists and password is correct.
Responds "This user does not exist." if no username is found in database.

#### Request body

```
"username=username&password=password"
```

#### Response body

```
curl http://localhost:5000/app/login/ -d "username=username&password=password"
```
```
"You are already logged in as otheruser."
```
```
"Logged in as username."
```
```
"This user does not exist"
```

### /app/createuser/
Responds "This user is already taken." if username already exists in database.
Responds "New user has been created." otherwise.

#### Response body

```
curl http://localhost:5000/app/createuser/ -d "username=username&password=password"
```
```
This username is already taken.
```
```
New user username has been created.
```
### /app/allusers/
Responds with a list of json of all users currently in the database

#### Response body

```
curl http://localhost:5000/app/allusers/
```

```json
[{"username":"admin"},{"username":"bekab"},{"username":"user1"},{"username":"user2"}]

```
### /app/post/
#### Request body
```
"post=message"
```

#### Response body

```
curl http://localhost:5000/app/post/ -d "post=blah"
```
```json
{"changes":1,"lastInsertRowid":10}
```
### /app/allposts/

#### Response body

```
curl http://localhost:5000/app/allposts
```

```json
[{"username":"bekab","post":"blah"},{"username":"user1","post":"hi user2"},{"username":"user2","post":"shut up"}]
```
### /app/getpost/:username

#### Response body

```
curl http://localhost:5000/app/getpost/bekab
```
```json
[{"username":"bekab","post":"blah"}]
```

### /app/user/info/:username

#### Response body

```
curl http://localhost:5000/app/user/info/bekab
```
```
User bekab has made 5 posts.
```

### /app/user/info/update/:username/
#### Response body
```
curl http://localhost:5000/app/user/info/update/:username
```
```

```
### /app/user/delete/:username/
#### Response body
```
curl http://localhost:5000/app/user/info/update/:username
```
```

```
