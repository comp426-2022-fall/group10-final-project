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
"username=(username)&password=(password)"
```

#### Response body

```
curl http://localhost:5000/app/login/ -d "username=username&password=password"
```
```
"You are already logged in as other user."
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
[{"username":"admin"},{"username":"username"},{"username":"user1"},{"username":"user2"}]

```
### /app/post/
#### Request body
```
"post=(message)"
```

#### Response body

```
curl http://localhost:5000/app/post/ -d "post=Test post"
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
[{"username":"username","post":"Test post"},{"username":"user1","post":"hi user2"},{"username":"user2","post":"shut up"}]
```
### /app/getpost/:username

#### Response body

```
curl http://localhost:5000/app/getpost/username
```
```json
[{"username":"username","post":"Test post"}]
```

### /app/user/info/:username

#### Response body

```
curl http://localhost:5000/app/user/info/username
```
```
User username has made 5 posts.
```

### /app/user/info/update/:username/:password/
Responds with "Password for :username updated successfully" if the password is updated.
Responds with "Password did not match for user" if the user's password is wrong.

#### Request body
```
"password=(user password)"
```
#### Response body
```
curl http://localhost:5000/app/user/info/update/username/newpassword -d "password=password"
```
```
Password for username updated successfully.
```
```
Password did not match for user.
```

### /app/user/info/updatename/:username/:newusername/
Responds with "Username updated from :username to :newusername" if the username is updated.
Responds with "Password did not match for user" if the user's password is wrong.

#### Request body
```
"password=(user password)"
```
#### Response body
```
curl http://localhost:5000/app/user/info/updatename/username/newusername -d "password=password"
```
```
Username updated from username to newusername.
```
```
Password did not match for user.
```
### /app/user/delete/:username/
Responds with "Successfully deleted user username" if the user is deleted.
Responds with "Incorrect passowrd" if the inputted password is wrong.
#### Request body
```
"password=(user password)"
```
#### Response body
```
curl http://localhost:5000/app/user/info/delete/username -d "password=password"
```
```
Successfully deleted user username.
```
```
Incorrect password.
```